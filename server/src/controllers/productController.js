import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Obtiene la lista completa de prendas de vestir aprobadas con sus variantes e imágenes.
 * 
 * @route   GET /api/products
 * @desc    Realiza consultas SQL avanzadas utilizando agregaciones JSON de PostgreSQL (json_agg y json_build_object).
 *          Esto permite retornar en una sola consulta toda la estructura jerárquica del producto,
 *          evitando el problema de consultas múltiples recurrentes (N+1 queries).
 * @access  Público
 */
export const getProductsWithVariants = asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.description,
      p.technique,
      p.material,
      p.category,
      p.base_price,
      a.name AS artisan_name,
      a.community AS artisan_community,
      -- Agregación JSON para empaquetar todas las variantes asociadas del producto
      (
        SELECT COALESCE(json_agg(json_build_object(
          'variant_id', pv.id,
          'color', pv.color,
          'size', pv.size_label,
          'measurements', pv.measurements,
          'stock', pv.stock
        )), '[]')
        FROM product_variants pv WHERE pv.product_id = p.id
      ) AS variants,
      -- Agregación JSON para agrupar las rutas de imágenes en un arreglo plano de cadenas
      (
        SELECT COALESCE(json_agg(pi.image_name), '[]')
        FROM product_images pi WHERE pi.product_id = p.id
      ) AS images
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    WHERE p.is_hidden = FALSE -- Filtra únicamente las prendas visibles no ocultadas por moderación
    ORDER BY p.title ASC;
  `;

  const result = await pool.query(query);
  res.json(result.rows);
});

/**
 * Obtiene el detalle individual de un producto por su UUID.
 * 
 * @route   GET /api/products/:id
 * @desc    Consulta un producto específico inyectando de forma anidada sus variantes e imágenes en formato JSON.
 * @access  Público
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.id AS product_id,
      p.title,
      p.description,
      p.technique,
      p.material,
      p.category,
      p.base_price,
      a.id AS artisan_id,
      a.name AS artisan_name,
      a.community AS artisan_community,
      a.bio AS artisan_bio,
      (
        SELECT COALESCE(json_agg(json_build_object(
          'variant_id', pv.id,
          'color', pv.color,
          'size', pv.size_label,
          'measurements', pv.measurements,
          'stock', pv.stock
        )), '[]')
        FROM product_variants pv WHERE pv.product_id = p.id
      ) AS variants,
      (
        SELECT COALESCE(json_agg(pi.image_name), '[]')
        FROM product_images pi WHERE pi.product_id = p.id
      ) AS images
    FROM products p
    JOIN artisans a ON p.artisan_id = a.id
    WHERE p.id = $1 AND p.is_hidden = FALSE;
  `;

  const result = await pool.query(query, [id]);
  
  if (result.rows.length === 0) {
    const err = new Error("Producto no encontrado");
    err.statusCode = 404; // Not Found
    throw err;
  }
  
  res.json(result.rows[0]);
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Registra y publica una nueva prenda en el catálogo general.
 * 
 * @route   POST /api/products
 * @desc    Crea una prenda de vestir asociada a la cuenta del artesano autenticado,
 *          crea automáticamente su variante por defecto (talla/stock) y registra su foto principal.
 * @access  Privado (Artesano registrado)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, technique, material, category, base_price, stock, size_label, image_name } = req.body;
  const artisanId = req.user.artisan_id;

  if (!artisanId) {
    // Limpiar archivo si se subió pero hay un error de validación
    if (req.file) fs.unlinkSync(req.file.path);
    const err = new Error("No tienes un perfil de artesano registrado para publicar prendas");
    err.statusCode = 403;
    throw err;
  }

  if (!title || !technique || !material || !category || !base_price || !stock) {
    if (req.file) fs.unlinkSync(req.file.path);
    const err = new Error("Los campos título, técnica, material, categoría, precio y stock son obligatorios");
    err.statusCode = 400;
    throw err;
  }

  // 1. Insertar prenda base en la tabla 'products'
  const productQuery = `
    INSERT INTO products (artisan_id, title, description, technique, material, category, base_price)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, title, category, base_price
  `;
  const productRes = await pool.query(productQuery, [
    artisanId,
    title.trim(),
    description ? description.trim() : null,
    technique.trim(),
    material.trim(),
    category.trim(),
    parseFloat(base_price)
  ]);

  const product = productRes.rows[0];

  // 2. Insertar una variante de stock inicial
  const variantQuery = `
    INSERT INTO product_variants (product_id, color, size_label, stock)
    VALUES ($1, 'Único/Tradicional', $2, $3)
  `;
  await pool.query(variantQuery, [
    product.id,
    size_label ? size_label.trim() : "Unitalla",
    parseInt(stock, 10)
  ]);

  // 3. Vincular la foto. Si se subió con multer, usar filename; sino usar el enviado por body o fallback.
  let imgName = 'valles1.jpg';
  if (req.file) {
    imgName = req.file.filename;
  } else if (image_name) {
    imgName = image_name.trim();
  }

  await pool.query(
    `INSERT INTO product_images (product_id, image_name, is_primary)
     VALUES ($1, $2, TRUE)`,
    [product.id, imgName]
  );

  res.status(201).json({
    message: "Prenda publicada con éxito en el catálogo de Xhaba",
    product
  });
});

/**
 * Actualiza la foto de un producto y elimina la anterior.
 * 
 * @route   PUT /api/products/:id/image
 * @desc    Cambia la imagen asociada y borra físicamente el archivo viejo para no generar basura.
 * @access  Privado (Artesano)
 */
export const updateProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const artisanId = req.user.artisan_id;

  if (!req.file) {
    const err = new Error("No se ha enviado ninguna imagen");
    err.statusCode = 400;
    throw err;
  }

  // Verificar si el producto pertenece al artesano
  const checkRes = await pool.query("SELECT id FROM products WHERE id = $1 AND artisan_id = $2", [id, artisanId]);
  if (checkRes.rows.length === 0) {
    fs.unlinkSync(req.file.path);
    const err = new Error("No tienes permiso para editar esta prenda o no existe");
    err.statusCode = 403;
    throw err;
  }

  // Obtener la imagen actual
  const imgRes = await pool.query("SELECT image_name FROM product_images WHERE product_id = $1 AND is_primary = TRUE", [id]);
  
  if (imgRes.rows.length > 0) {
    const oldImage = imgRes.rows[0].image_name;
    // Si la imagen anterior no es una de las precargadas, intentar borrarla del disco
    if (!['valles1.jpg', 'valles2.jpg', 'valles3.jpg', 'istmo1.jpg', 'istmo2.jpg', 'istmo3.jpg', 'costa1.jpg', 'costa2.jpg', 'costa3.jpg', 'mixteca1.jpg', 'mixteca2.jpg', 'mixteca3.jpg', 'papaloapan1.jpg', 'papaloapan2.jpg', 'papaloapan3.jpg', 'canada1.jpg', 'canada2.jpg', 'canada3.jpg'].includes(oldImage)) {
      const oldPath = path.join(__dirname, '../../uploads', oldImage);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Error al eliminar la imagen anterior:", e);
        }
      }
    }
    // Actualizar registro en base de datos
    await pool.query(
      "UPDATE product_images SET image_name = $1 WHERE product_id = $2 AND is_primary = TRUE",
      [req.file.filename, id]
    );
  } else {
    // Si no tenía imagen primaria por algún motivo, insertar una
    await pool.query(
      "INSERT INTO product_images (product_id, image_name, is_primary) VALUES ($1, $2, TRUE)",
      [id, req.file.filename]
    );
  }

  res.json({ message: "Imagen actualizada correctamente", image_name: req.file.filename });
});

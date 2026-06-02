import pool from "./db.js";
import bcrypt from "bcryptjs";

export const ensureDatabaseSchema = async () => {
  try {
    console.log("Checking database schema updates...");
    
    // 1. Agregar columnas en la tabla users y relacionar con artisans
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS municipio VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS barrio VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS artisan_id UUID REFERENCES artisans(id) ON DELETE SET NULL;
    `);

    // 2. Agregar columnas en la tabla products
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
    `);

    // 3. Crear tabla de reviews si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database columns and tables checked.");

    // 4. Sembrar el perfil del artesano "Familia Mendoza" si no existe
    const mendozaId = "a4444444-4444-4444-4444-444444444444";
    const checkArtisan = await pool.query("SELECT id FROM artisans WHERE id = $1", [mendozaId]);
    if (checkArtisan.rows.length === 0) {
      console.log("Seeding Familia Mendoza artisan profile...");
      await pool.query(`
        INSERT INTO artisans (id, name, community, state, bio)
        VALUES ($1, 'Familia Mendoza', 'San Antonino Castillo Velasco', 'Oaxaca', 'Tradición familiar en el bordado a mano de San Antonino desde 1950.')
      `, [mendozaId]);
    }

    // 5. Sembrar cuentas específicas de demo si no existen por email
    const demoAccounts = [
      { name: "Juan Cliente", email: "client@xhaba.com", password: "client123", age: 30, municipio: "Oaxaca de Juárez", barrio: "Centro", role: "client", artisan_id: null },
      { name: "Familia Mendoza", email: "artisan@xhaba.com", password: "artisan123", age: 45, municipio: "San Antonino Castillo Velasco", barrio: "Centro", role: "artisan", artisan_id: mendozaId },
      { name: "Admin Principal", email: "admin@xhaba.com", password: "admin123", age: null, municipio: null, barrio: null, role: "admin", artisan_id: null }
    ];

    const saltRounds = 10;

    for (const account of demoAccounts) {
      const checkRes = await pool.query("SELECT id FROM users WHERE email = $1", [account.email]);
      if (checkRes.rows.length === 0) {
        console.log(`Seeding demo account: ${account.email}...`);
        const passwordHash = await bcrypt.hash(account.password, saltRounds);
        
        await pool.query(`
          INSERT INTO users (name, email, password_hash, age, municipio, barrio, role, artisan_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          account.name,
          account.email,
          passwordHash,
          account.age,
          account.municipio,
          account.barrio,
          account.role,
          account.artisan_id
        ]);
      } else {
        if (account.artisan_id) {
          await pool.query(`
            UPDATE users SET artisan_id = $1 WHERE email = $2 AND artisan_id IS NULL
          `, [account.artisan_id, account.email]);
        }
      }
    }
    
    // 6. Sembrar un par de productos reales para Familia Mendoza si no tiene ninguno
    const productCheck = await pool.query("SELECT id FROM products WHERE artisan_id = $1", [mendozaId]);
    if (productCheck.rows.length === 0) {
      console.log("Seeding products for Familia Mendoza...");
      const p1Id = "d1111111-1111-1111-1111-111111111111";
      const p2Id = "d2222222-2222-2222-2222-222222222222";
      
      await pool.query(`
        INSERT INTO products (id, artisan_id, title, description, technique, material, category, base_price)
        VALUES 
          ($1, $3, 'Huipil \"Hazme si puedes\" Bordado', 'Bordado tradicional de San Antonino con hilos de seda de flores silvestres.', 'Bordado a mano', 'Manta natural', 'Huipiles', 2450.00),
          ($2, $3, 'Blusa de Manta con Grecas', 'Blusa tradicional de algodón con detalles de grecas tejidas a mano.', 'Telar de pedal', 'Algodón', 'Blusas', 850.00)
      `, [p1Id, p2Id, mendozaId]);

      // Agregar variantes
      await pool.query(`
        INSERT INTO product_variants (product_id, stock)
        VALUES 
          ($1, 2),
          ($2, 5)
      `, [p1Id, p2Id]);
    }

    // 7. Sembrar valoraciones (reviews) reales si la tabla está vacía
    const reviewCheck = await pool.query("SELECT COUNT(*) FROM reviews");
    if (parseInt(reviewCheck.rows[0].count, 10) === 0) {
      console.log("Seeding reviews for Familia Mendoza...");
      await pool.query(`
        INSERT INTO reviews (artisan_id, customer_name, rating, comment)
        VALUES 
          ($1, 'Ana Gómez', 5, 'Hermoso bordado, muy buena calidad y atención excelente.'),
          ($1, 'Luis Pérez', 4, 'La tela es fresca, el envío tardó un poco pero valió la pena.')
      `, [mendozaId]);
    }

    console.log("✅ Demo accounts, products and reviews verified/seeded.");
  } catch (err) {
    console.error("❌ Error applying schema updates or seeding:", err.message);
  }
};

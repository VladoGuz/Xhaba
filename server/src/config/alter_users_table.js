import pool from "./db.js";
import bcrypt from "bcryptjs";

/**
 * Asegura la existencia y actualización del esquema de la base de datos (migraciones)
 * y realiza el sembrado (seeding) inicial de datos para pruebas.
 * 
 * Este método corre de forma automática cada vez que se levanta el servidor Express.
 * Ejecuta consultas DDL (Data Definition Language) de forma idempotente (usando IF NOT EXISTS)
 * y DML (Data Manipulation Language) verificando previamente la existencia de registros.
 */
export const ensureDatabaseSchema = async () => {
  try {
    console.log("Checking database schema updates...");
    
    // 1. Agregar columnas faltantes a la tabla 'users' para perfiles detallados de artesanos y clientes,
    // y para permitir el bloqueo/suspensión de cuentas ('is_banned').
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS municipio VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS barrio VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS artisan_id UUID REFERENCES artisans(id) ON DELETE SET NULL;
    `);

    // 2. Agregar columnas a la tabla 'products' para soportar el ocultamiento lógico de prendas.
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
    `);

    // 3. Crear tabla de calificaciones/reseñas ('reviews') si no existe.
    // Vincula a un artesano ('artisan_id') y guarda el nombre del cliente, puntaje de 1 a 5, y comentario.
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

    // 4. Crear tabla de imágenes de productos ('product_images') si no existe.
    // Permite soportar múltiples imágenes por producto, indicando cuál es la imagen principal ('is_primary').
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        image_name VARCHAR(255) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Crear tabla del carrito de compras persistente ('cart_items') si no existe.
    // Vincula el usuario ('user_id') con la variante de producto ('variant_id') y su cantidad.
    // Posee una restricción UNIQUE compuesta para evitar duplicar la misma variante para un mismo usuario.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, variant_id)
      );
    `);

    console.log("✅ Database columns and tables checked.");

    // 6. Listado de 18 artesanos demostrativos distribuidos en las regiones representativas de Oaxaca
    // (Valles Centrales, Istmo, Costa, Mixteca, Papaloapan, Cañada) con sus respectivos productos
    // e imágenes físicas reales de ropa típica.
    const artisansToSeed = [
      // === VALLES CENTRALES ===
      {
        name: "Sofía Martínez",
        email: "sofia.valles@xhaba.com",
        age: 38,
        region: "Valles Centrales",
        community: "Teotitlán del Valle",
        municipio: "Teotitlán del Valle",
        barrio: "Sección Primera",
        bio: "Tejedora de tapetes de lana con tintes naturales de grana cochinilla y ocre cempasúchil.",
        products: [
          {
            title: "Tapete Zapoteca Diamante",
            description: "Tapete de lana tejido en telar de pedal con diseño geométrico y teñido con tintes orgánicos.",
            technique: "Telar de pedal",
            material: "Lana",
            category: "Rebozos",
            basePrice: 1850.00,
            stock: 3,
            size: "120x80cm",
            images: ["valles1.jpg", "valles3.jpg"]
          }
        ]
      },
      {
        name: "Familia Mendoza",
        email: "artisan@xhaba.com",
        age: 45,
        region: "Valles Centrales",
        community: "San Antonino Castillo Velasco",
        municipio: "San Antonino Castillo Velasco",
        barrio: "Centro",
        bio: "Tradición familiar en el bordado a mano de San Antonino desde 1950.",
        products: [
          {
            id: "d1111111-1111-1111-1111-111111111111",
            title: "Huipil \"Hazme si puedes\" Bordado",
            description: "Bordado tradicional de San Antonino con hilos de seda de flores silvestres.",
            technique: "Bordado a mano",
            material: "Manta natural",
            category: "Huipiles",
            basePrice: 2450.00,
            stock: 2,
            size: "M",
            images: ["valles1.jpg", "valles3.jpg"]
          },
          {
            id: "d2222222-2222-2222-2222-222222222222",
            title: "Blusa de Manta con Grecas",
            description: "Blusa tradicional de algodón con detalles de grecas tejidas a mano.",
            technique: "Telar de pedal",
            material: "Algodón",
            category: "Blusas",
            basePrice: 850.00,
            stock: 5,
            size: "Unitalla",
            images: ["valles2.jpg"]
          }
        ]
      },
      {
        name: "Carlos Ruiz",
        email: "carlos.valles@xhaba.com",
        age: 52,
        region: "Valles Centrales",
        community: "Mitla",
        municipio: "San Pablo Villa de Mitla",
        barrio: "Barrio de la Asunción",
        bio: "Maestro del telar de pedal, elaborando rebozos tradicionales con grecas inspiradas en las zonas arqueológicas.",
        products: [
          {
            title: "Rebozo Fino con Grecas de Mitla",
            description: "Rebozo de algodón tejido a pedal con grecas tradicionales estilizadas.",
            technique: "Telar de pedal",
            material: "Algodón",
            category: "Rebozos",
            basePrice: 950.00,
            stock: 4,
            size: "Largo 2m",
            images: ["valles3.jpg", "valles1.jpg"]
          }
        ]
      },

      // === ISTMO ===
      {
        name: "Juana López",
        email: "juana.istmo@xhaba.com",
        age: 42,
        region: "Istmo",
        community: "Juchitán de Zaragoza",
        municipio: "Heroica Ciudad de Juchitán de Zaragoza",
        barrio: "Sección Quinta",
        bio: "Bordadora tradicional de trajes de gala del Istmo de Tehuantepec.",
        products: [
          {
            title: "Traje de Gala Istmeño",
            description: "Huipil y falda de terciopelo negro bordado a mano con flores de hilos de seda.",
            technique: "Bordado a mano",
            material: "Seda",
            category: "Huipiles",
            basePrice: 3800.00,
            stock: 1,
            size: "G",
            images: ["istmo1.jpg", "istmo2.jpg"]
          }
        ]
      },
      {
        name: "Xhunaxhi Jiménez",
        email: "xhunaxhi.istmo@xhaba.com",
        age: 39,
        region: "Istmo",
        community: "Santo Domingo Tehuantepec",
        municipio: "Santo Domingo Tehuantepec",
        barrio: "Barrio de Santa María",
        bio: "Especialista en bordado de cadenilla con máquina de pedal antigua.",
        products: [
          {
            title: "Huipil de Cadenilla Tradicional",
            description: "Huipil de satín rojo con patrones geométricos bordados en técnica de cadenilla clásica.",
            technique: "Bordado a mano",
            material: "Seda",
            category: "Huipiles",
            basePrice: 1200.00,
            stock: 3,
            size: "M",
            images: ["istmo2.jpg", "istmo3.jpg"]
          }
        ]
      },
      {
        name: "Maritza Toledo",
        email: "maritza.istmo@xhaba.com",
        age: 48,
        region: "Istmo",
        community: "Ixtepec",
        municipio: "Ciudad Ixtepec",
        barrio: "Barrio San Antonio",
        bio: "Artesana de tocados y huipiles de terciopelo bordados con flores coloridas.",
        products: [
          {
            title: "Huipil Bordado de Terciopelo",
            description: "Huipil de terciopelo azul marino con flores silvestres bordadas a mano alzada.",
            technique: "Bordado a mano",
            material: "Seda",
            category: "Huipiles",
            basePrice: 1650.00,
            stock: 2,
            size: "CH",
            images: ["istmo3.jpg", "istmo1.jpg"]
          }
        ]
      },

      // === COSTA ===
      {
        name: "Petra Silva",
        email: "petra.costa@xhaba.com",
        age: 60,
        region: "Costa",
        community: "Santiago Pinotepa Nacional",
        municipio: "Santiago Pinotepa Nacional",
        barrio: "Barrio del Calvario",
        bio: "Tejedora de telar de cintura que plasma la flora y fauna de la costa chica.",
        products: [
          {
            title: "Huipil de Pinotepa Nacional",
            description: "Huipil ligero de algodón hilado a mano con detalles bordados en colores pastel.",
            technique: "Telar de cintura",
            material: "Algodón",
            category: "Huipiles",
            basePrice: 1550.00,
            stock: 2,
            size: "Unitalla",
            images: ["costa1.jpg", "costa2.jpg"]
          }
        ]
      },
      {
        name: "Elena Salinas",
        email: "elena.costa@xhaba.com",
        age: 37,
        region: "Costa",
        community: "San Pedro Amuzgos",
        municipio: "San Pedro Amuzgos",
        barrio: "Barrio del Centro",
        bio: "Tejedora de brocados en algodón natural coyuchi de herencia amuzga.",
        products: [
          {
            title: "Huipil Amuzgo con Brocados",
            description: "Tejido en telar de cintura con brocados de figuras zoomorfas y fitomorfas de la cosmovisión amuzga.",
            technique: "Telar de cintura",
            material: "Algodón",
            category: "Huipiles",
            basePrice: 2200.00,
            stock: 2,
            size: "M",
            images: ["costa2.jpg", "costa3.jpg"]
          }
        ]
      },
      {
        name: "Antonia Reyes",
        email: "antonia.costa@xhaba.com",
        age: 41,
        region: "Costa",
        community: "Santa María Huazolotitlán",
        municipio: "Santa María Huazolotitlán",
        barrio: "Barrio de la Santa Cruz",
        bio: "Confeccionadora de faldas de enredo y blusas costeñas de manta fina.",
        products: [
          {
            title: "Blusa Costeña Bordada",
            description: "Blusa fresca de manta de algodón con pliegues y bordados florales en cuello y mangas.",
            technique: "Bordado a mano",
            material: "Manta natural",
            category: "Blusas",
            basePrice: 780.00,
            stock: 5,
            size: "G",
            images: ["costa3.jpg", "costa1.jpg"]
          }
        ]
      },

      // === MIXTECA ===
      {
        name: "Gudelia Hernández",
        email: "gudelia.mixteca@xhaba.com",
        age: 55,
        region: "Mixteca",
        community: "San Juan Copala",
        municipio: "Santiago Juxtlahuaca",
        barrio: "Sección Segunda",
        bio: "Tejedora tradicional del huipil rojo triqui de telar de cintura.",
        products: [
          {
            title: "Huipil Rojo Triqui Copala",
            description: "El clásico huipil rojo tejido en telar de cintura con franjas horizontales bordadas y cintas de colores.",
            technique: "Telar de cintura",
            material: "Algodón",
            category: "Huipiles",
            basePrice: 3200.00,
            stock: 1,
            size: "Largo 1.1m",
            images: ["mixteca1.jpg", "mixteca2.jpg"]
          }
        ]
      },
      {
        name: "Maximina Castro",
        email: "maximina.mixteca@xhaba.com",
        age: 49,
        region: "Mixteca",
        community: "Heroica Ciudad de Tlaxiaco",
        municipio: "Heroica Ciudad de Tlaxiaco",
        barrio: "Barrio de San Diego",
        bio: "Especialista en fajas tejidas y blusas con cuello bordado mixteco.",
        products: [
          {
            title: "Blusa Mixteca Bordada a Mano",
            description: "Blusa tradicional de Tlaxiaco con bordados de punto de cruz en el cuello cuadrado.",
            technique: "Bordado a mano",
            material: "Algodón",
            category: "Blusas",
            basePrice: 890.00,
            stock: 3,
            size: "M",
            images: ["mixteca2.jpg", "mixteca3.jpg"]
          }
        ]
      },
      {
        name: "Ismael López",
        email: "ismael.mixteca@xhaba.com",
        age: 46,
        region: "Mixteca",
        community: "Santiago Yosondúa",
        municipio: "Santiago Yosondúa",
        barrio: "Barrio del Centro",
        bio: "Tejedor de rebozos de lana y manta teñidos con corteza de encino.",
        products: [
          {
            title: "Rebozo Mixteco de Lana",
            description: "Rebozo abrigador de lana de borrego teñido artesanalmente con elementos naturales.",
            technique: "Telar de pedal",
            material: "Lana",
            category: "Rebozos",
            basePrice: 1100.00,
            stock: 3,
            size: "Largo 1.8m",
            images: ["mixteca3.jpg", "mixteca1.jpg"]
          }
        ]
      },

      // === PAPALOAPAN ===
      {
        name: "Fulgencia Cruz",
        email: "fulgencia.papaloapan@xhaba.com",
        age: 50,
        region: "Papaloapan",
        community: "Jalapa de Díaz",
        municipio: "San Felipe Jalapa de Díaz",
        barrio: "Sección Tercera",
        bio: "Famosa por sus bordados densos de pájaros y flores sobre manta de colores.",
        products: [
          {
            title: "Vestido Jalapeño Multicolor",
            description: "Vestido completo de manta negra bordado profusamente con pájaros y flores típicas de la región chinanteca.",
            technique: "Bordado a mano",
            material: "Manta natural",
            category: "Blusas",
            basePrice: 1950.00,
            stock: 2,
            size: "G",
            images: ["papaloapan1.jpg", "papaloapan2.jpg"]
          }
        ]
      },
      {
        name: "Paula Ortiz",
        email: "paula.papaloapan@xhaba.com",
        age: 43,
        region: "Papaloapan",
        community: "San Felipe Usila",
        municipio: "San Felipe Usila",
        barrio: "Barrio de la Cruz",
        bio: "Tejedora del icónico huipil usileño que narra la historia chinanteca.",
        products: [
          {
            title: "Huipil Chinanteco de Usila",
            description: "Tejido en telar de cintura con brocados rojos y guindas que forman figuras geométricas e iconografía prehispánica.",
            technique: "Telar de cintura",
            material: "Algodón",
            category: "Huipiles",
            basePrice: 2800.00,
            stock: 1,
            size: "M",
            images: ["papaloapan2.jpg", "papaloapan3.jpg"]
          }
        ]
      },
      {
        name: "Tomasa García",
        email: "tomasa.papaloapan@xhaba.com",
        age: 63,
        region: "Papaloapan",
        community: "Valle Nacional",
        municipio: "San Juan Bautista Valle Nacional",
        barrio: "Barrio San Mateo",
        bio: "Bordadora de huipiles tradicionales chinantecos decorados con listones.",
        products: [
          {
            title: "Huipil Tradicional Chinanteco",
            description: "Huipil clásico chinanteco con listones satinados y encajes cosidos a mano.",
            technique: "Bordado a mano",
            material: "Algodón",
            category: "Huipiles",
            basePrice: 1600.00,
            stock: 3,
            size: "Unitalla",
            images: ["papaloapan3.jpg", "papaloapan1.jpg"]
          }
        ]
      },

      // === CAÑADA ===
      {
        name: "Manuela Merino",
        email: "manuela.canada@xhaba.com",
        age: 47,
        region: "Cañada",
        community: "Huautla de Jiménez",
        municipio: "Huautla de Jiménez",
        barrio: "Barrio de la Soledad",
        bio: "Artesana mazateca que borda huipiles con listones azul y rosa y aves del bosque nuboso.",
        products: [
          {
            title: "Huipil Mazateco con Listones",
            description: "El tradicional huipil mazateco bordado a mano con flores, pajaritos y decorado con listones de satín rosa y azul claro.",
            technique: "Bordado a mano",
            material: "Manta natural",
            category: "Huipiles",
            basePrice: 2100.00,
            stock: 2,
            size: "M",
            images: ["canada1.jpg", "canada2.jpg"]
          }
        ]
      },
      {
        name: "Avelina Allende",
        email: "avelina.canada@xhaba.com",
        age: 51,
        region: "Cañada",
        community: "San Jerónimo Tecóatl",
        municipio: "San Jerónimo Tecóatl",
        barrio: "Sección de la Asunción",
        bio: "Bordadora tradicional de blusas de diario con pájaros silvestres mazatecos.",
        products: [
          {
            title: "Blusa Mazateca Bordada",
            description: "Blusa fina bordada en punto de cruz con aves representativas del norte de Oaxaca.",
            technique: "Bordado a mano",
            material: "Algodón",
            category: "Blusas",
            basePrice: 850.00,
            stock: 4,
            size: "CH",
            images: ["canada2.jpg", "canada3.jpg"]
          }
        ]
      },
      {
        name: "Clementina Prado",
        email: "clementina.canada@xhaba.com",
        age: 58,
        region: "Cañada",
        community: "Teotitlán de Flores Magón",
        municipio: "Teotitlán de Flores Magón",
        barrio: "Barrio del Centenario",
        bio: "Tejedora de rebozos de algodón hilados a mano con malacate.",
        products: [
          {
            title: "Rebozo Mazateco Fino",
            description: "Rebozo tejido en telar con algodón fino teñido a mano y flecos anudados artesanalmente.",
            technique: "Telar de pedal",
            material: "Algodón",
            category: "Rebozos",
            basePrice: 1250.00,
            stock: 3,
            size: "Largo 2m",
            images: ["canada3.jpg", "canada1.jpg"]
          }
        ]
      }
    ];

    const saltRounds = 10;

    // 7. Sembrar cuentas predeterminadas de Juan Cliente y Admin Principal para facilitar pruebas
    const demoAccounts = [
      { name: "Juan Cliente", email: "client@xhaba.com", password: "client123", age: 30, municipio: "Oaxaca de Juárez", barrio: "Centro", role: "client" },
      { name: "Admin Principal", email: "admin@xhaba.com", password: "admin123", age: null, municipio: null, barrio: null, role: "admin" }
    ];

    for (const account of demoAccounts) {
      const checkRes = await pool.query("SELECT id FROM users WHERE email = $1", [account.email]);
      if (checkRes.rows.length === 0) {
        console.log(`Seeding demo account: ${account.email}...`);
        const passwordHash = await bcrypt.hash(account.password, saltRounds);
        await pool.query(`
          INSERT INTO users (name, email, password_hash, age, municipio, barrio, role)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          account.name,
          account.email,
          passwordHash,
          account.age,
          account.municipio,
          account.barrio,
          account.role
        ]);
      }
    }

    // 8. Sembrar la lista de artesanos y sus respectivos productos de forma idempotente.
    // Esto asegura que si ya existen los artesanos y prendas en la base de datos,
    // el script no intente recrearlos ni arroje errores por llaves duplicadas.
    console.log("Seeding regional artisans, users, and products...");
    for (const art of artisansToSeed) {
      
      // a. Insertar en la tabla 'artisans'
      let artisanId;
      const checkArt = await pool.query(
        "SELECT id FROM artisans WHERE name = $1 AND community = $2",
        [art.name, art.community]
      );

      if (checkArt.rows.length === 0) {
        // La Familia Mendoza tiene un UUID preestablecido ('a4444444-4444-4444-4444-444444444444')
        // para facilitar la vinculación estática de reseñas en el seeding posterior.
        const isMendoza = art.name === "Familia Mendoza";
        const insertQuery = isMendoza
          ? `INSERT INTO artisans (id, name, community, state, bio) VALUES ('a4444444-4444-4444-4444-444444444444', $1, $2, 'Oaxaca', $3) RETURNING id`
          : `INSERT INTO artisans (name, community, state, bio) VALUES ($1, $2, 'Oaxaca', $3) RETURNING id`;
        
        const artRes = await pool.query(insertQuery, [art.name, art.community, art.bio]);
        artisanId = artRes.rows[0].id;
      } else {
        artisanId = checkArt.rows[0].id;
      }

      // b. Crear la cuenta de usuario de tipo 'artisan' vinculada al perfil del artesano creado
      const checkUser = await pool.query("SELECT id FROM users WHERE email = $1", [art.email]);
      if (checkUser.rows.length === 0) {
        // Todos los artesanos sembrados tienen la misma contraseña predeterminada: 'artisan123'
        const userHash = await bcrypt.hash("artisan123", saltRounds);
        await pool.query(
          `INSERT INTO users (name, email, password_hash, age, municipio, barrio, role, artisan_id)
           VALUES ($1, $2, $3, $4, $5, $6, 'artisan', $7)`,
          [art.name, art.email, userHash, art.age, art.municipio, art.barrio, artisanId]
        );
      } else {
        // En caso de que el usuario ya exista pero no tenga referenciado su artisan_id, lo actualiza.
        await pool.query(
          "UPDATE users SET artisan_id = $1 WHERE email = $2 AND artisan_id IS NULL",
          [artisanId, art.email]
        );
      }

      // c. Sembrar cada uno de los productos que ofrece el artesano
      for (const prod of art.products) {
        const checkProd = await pool.query(
          "SELECT id FROM products WHERE artisan_id = $1 AND title = $2",
          [artisanId, prod.title]
        );

        if (checkProd.rows.length === 0) {
          let productId;
          // Si el producto tiene un ID duro preestablecido (para pruebas consistentes de endpoints) se respeta,
          // de lo contrario se autogenera en PostgreSQL.
          const insertProdQuery = prod.id
            ? `INSERT INTO products (id, artisan_id, title, description, technique, material, category, base_price)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
            : `INSERT INTO products (artisan_id, title, description, technique, material, category, base_price)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
          
          const prodParams = prod.id
            ? [prod.id, artisanId, prod.title, prod.description, prod.technique, prod.material, prod.category, prod.basePrice]
            : [artisanId, prod.title, prod.description, prod.technique, prod.material, prod.category, prod.basePrice];
          
          const prodRes = await pool.query(insertProdQuery, prodParams);
          productId = prodRes.rows[0].id;

          // d. Sembrar la variante por defecto (talla, color e inventario/stock) para habilitar compras
          await pool.query(
            `INSERT INTO product_variants (product_id, color, size_label, stock)
             VALUES ($1, 'Único/Tradicional', $2, $3)`,
            [productId, prod.size, prod.stock]
          );

          // e. Sembrar las múltiples fotos asociadas al producto en la tabla 'product_images'
          for (let i = 0; i < prod.images.length; i++) {
            const isPrimary = i === 0; // La primera imagen del arreglo será la principal
            await pool.query(
              `INSERT INTO product_images (product_id, image_name, is_primary)
               VALUES ($1, $2, $3)`,
              [productId, prod.images[i], isPrimary]
            );
          }
        }
      }
    }

    // 9. Sembrar reseñas demostrativas de clientes reales sobre la Familia Mendoza si no existen reseñas previas
    const mendozaId = "a4444444-4444-4444-4444-444444444444";
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

    console.log("✅ Demo accounts, regional artisans, products, variants and reviews verified/seeded.");
  } catch (err) {
    console.error("❌ Error applying schema updates or seeding:", err.message);
  }
};

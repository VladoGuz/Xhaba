import pool from "./db.js";
import bcrypt from "bcryptjs";

export const ensureDatabaseSchema = async () => {
  try {
    console.log("Checking database schema updates...");
    
    // 1. Agregar columnas si no existen
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS municipio VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS barrio VARCHAR(255);
    `);
    console.log("✅ Database columns checked.");

    // 2. Sembrar cuentas específicas de demo si no existen por email
    const demoAccounts = [
      { name: "Juan Cliente", email: "client@xhaba.com", password: "client123", age: 30, municipio: "Oaxaca de Juárez", barrio: "Centro", role: "client" },
      { name: "Familia Mendoza", email: "artisan@xhaba.com", password: "artisan123", age: 45, municipio: "Teotitlán del Valle", barrio: "Sección Segunda", role: "artisan" },
      { name: "Admin Principal", email: "admin@xhaba.com", password: "admin123", age: null, municipio: null, barrio: null, role: "admin" }
    ];

    const saltRounds = 10;

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
    console.log("✅ Demo accounts verified/seeded.");
  } catch (err) {
    console.error("❌ Error applying schema updates or seeding:", err.message);
  }
};

const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dzharfinance",
  port: process.env.DB_PORT || 3307,
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Database connected successfully!");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// connection.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed: " + err.stack); // Gunakan err.stack untuk detail
//     return;
//   }
//   console.log("✅ Database connected");
// });

module.exports = db; // export langsung

// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD,
//   database: process.env.MYSQLDATABASE,
//   port: process.env.MYSQLPORT || 3306,
// });

// (async () => {
//   try {
//     const conn = await pool.getConnection();
//     console.log("✅ Database connected");
//     conn.release();
//   } catch (err) {
//     console.error("❌ Database connection failed:", err.message);
//   }
// })();

// module.exports = { pool };

// module.exports = pool;

// module.exports = pool;

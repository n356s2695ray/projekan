const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // sesuaikan
  database: "dzharfinance", // sesuaikan
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();


module.exports = pool;

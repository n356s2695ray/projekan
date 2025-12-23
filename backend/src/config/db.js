// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "", // sesuaikan
//   database: "dzharfinance", // sesuaikan
//   port: 3307,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
const mysql = require("mysql2/promise"); // pake versi promise

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
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



// module.exports = pool;


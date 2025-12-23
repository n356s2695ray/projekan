const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================== CORS FIX ================== */
app.use(
  cors({
    origin: "*", // sementara (aman buat dev)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ================== ROUTES ================== */
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const transactionRoutes = require("./src/routes/transactionsRoutes");
const budgetRoutes = require("./src/routes/budgetsRoutes");
const walletsRoutes = require("./src/routes/walletsRoutes");
const authsRoutes = require("./src/routes/authRoutes");

app.get("/", (req, res) => {
  res.send("PONG");
});

app.use("/api/budgets", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/auth", authsRoutes);

/* ================== PORT ================== */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

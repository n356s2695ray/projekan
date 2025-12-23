const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dashboardRoutes = require("./src/routes/dashboardRoutes");
const transactionRoutes = require("./src/routes/transactionsRoutes");
const budgetRoutes = require("./src/routes/budgetsRoutes");
const walletsRoutes = require("./src/routes/walletsRoutes");
const authsRoutes = require("./src/routes/authRoutes");  
const app = express();


app.get("/", (req, res) => {
  res.send("PONG");
});
app.use(cors());
app.use(express.json());


app.use("/api/budgets", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/auth", authsRoutes);

console.log("✅ authRoutes loaded");

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

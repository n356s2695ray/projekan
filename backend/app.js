const express = require("express");
const cors = require("cors");
require("dotenv").config();

/* ============================= */
/*        EXPRESS APP             */
/* ============================= */
const app = express();

/* 🔥 CORS HARUS PALING ATAS */
app.use(
  cors({
    origin: "*", // sementara, nanti bisa dikunci
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* JSON PARSER */
app.use(express.json());

/* TEST */
app.get("/", (req, res) => {
  res.send("PONG");
});

/* ============================= */
/*          ROUTES                */
/* ============================= */
app.use("/api/budgets", require("./src/routes/budgetsRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));
app.use("/api/transactions", require("./src/routes/transactionsRoutes"));
app.use("/api/wallets", require("./src/routes/walletsRoutes"));
app.use("/api/auth", require("./src/routes/authRoutes"));

/* ============================= */
/*          START SERVER          */
/* ============================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/* LISTENING */
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

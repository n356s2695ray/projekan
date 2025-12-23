const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
} = require("../controllers/transactionsController");

router.use(authMiddleware);
// GET semua transaksi
router.get("/",  getTransactions);

// POST tambah transaksi
router.post("/", addTransaction);

// DELETE transaksi
router.delete("/:id", deleteTransaction);

module.exports = router;

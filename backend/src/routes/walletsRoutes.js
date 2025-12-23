// routes/wallets.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { transferWallet, getWallets } = require("../controllers/walletsController");

router.use(authMiddleware);
// POST transfer antar wallet
router.post("/transfer",  transferWallet);
// GET semua wallet
router.get("/",  getWallets);

module.exports = router;

// routes/budgetsRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
console.log("✅ budgetsRoutes loaded");

const {
  getBudgets,
  saveBudget,
  getBudgetUsage,
  deleteBudget
} = require("../controllers/budgetsController");

router.use(authMiddleware);
router.get("/", getBudgets);
router.get("/usage", getBudgetUsage);
router.post("/", saveBudget);
router.delete("/:id", deleteBudget);

module.exports = router;


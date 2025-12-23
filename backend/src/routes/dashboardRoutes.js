const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSummary,
  getCategoryChart,
  getDailyChart,
} = require("../controllers/dashboardController");

router.use(authMiddleware);
router.get("/summary",  getSummary);
router.get("/category",  getCategoryChart);
router.get("/daily",  getDailyChart);

module.exports = router;

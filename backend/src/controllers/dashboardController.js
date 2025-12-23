// controllers/dashboardController.js
const db = require("../config/db");

/**
 * SUMMARY
 * total income, expense, balance
 */
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
      FROM transactions
      WHERE user_id = ?
      `,
      [userId]
    );

    const { total_income, total_expense } = rows[0];

    res.json({
      success: true,
      data: {
        totalIncome: total_income,
        totalExpense: total_expense,
        balance: total_income - total_expense,
      },
    });
  } catch (error) {
    console.error("getSummary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};

/**
 * PIE CHART (expense per category)
 */
const getCategoryChart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        c.name AS category,
        COALESCE(SUM(t.amount), 0) AS total
      FROM categories c
      LEFT JOIN transactions t
        ON t.category_id = c.id
        AND t.user_id = ?
        AND t.type = 'expense'
      GROUP BY c.id, c.name
      ORDER BY total DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getCategoryChart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load category chart",
    });
  }
};

/**
 * DAILY CHART (income vs expense per day)
 */
const getDailyChart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        DATE(date) AS day,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM transactions
      WHERE user_id = ?
      GROUP BY DATE(date)
      ORDER BY day ASC
      `,
      [userId]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("getDailyChart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load daily chart",
    });
  }
};

module.exports = {
  getSummary,
  getCategoryChart,
  getDailyChart,
};

// controllers/budgetsController.js
const db = require("../config/db");

// ================= GET BUDGETS =================
const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const [rows] = await db.query(
      `
      SELECT
        b.id,
        b.category_id,
        c.name AS category,
        b.amount,
        b.month,
        b.year
      FROM budgets b
      JOIN categories c ON c.id = b.category_id
      WHERE b.user_id = ?
        AND b.month = ?
        AND b.year = ?
      `,
      [userId, month, year]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET BUDGET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= SAVE / UPDATE BUDGET =================
const saveBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, amount, month, year } = req.body;

    if (
      category_id == null ||
      amount == null ||
      month == null ||
      year == null
    ) {
      return res.status(400).json({ message: "Data budget tidak lengkap" });
    }

    const [existing] = await db.query(
      `
      SELECT id FROM budgets
      WHERE user_id = ? AND category_id = ? AND month = ? AND year = ?
      `,
      [userId, category_id, month, year]
    );

    if (existing.length > 0) {
      await db.query(
        `
        UPDATE budgets
        SET amount = ?
        WHERE user_id = ? AND category_id = ? AND month = ? AND year = ?
        `,
        [amount, userId, category_id, month, year]
      );
    } else {
      await db.query(
        `
        INSERT INTO budgets (user_id, category_id, amount, month, year)
        VALUES (?, ?, ?, ?, ?)
        `,
        [userId, category_id, amount, month, year]
      );
    }

    res.json({
      user_id: userId,
      category_id,
      amount,
      month,
      year,
    });
  } catch (err) {
    console.error("SAVE BUDGET ERROR:", err);
    res.status(500).json({
      message: "Gagal simpan budget",
      error: err.message,
    });
  }
};

// ================= GET BUDGET USAGE =================
const getBudgetUsage = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();

    const [rows] = await db.query(
      `
      SELECT
        b.category_id,
        b.amount AS budget,
        COALESCE(SUM(t.amount), 0) AS spent
      FROM budgets b
      LEFT JOIN transactions t
        ON t.category_id = b.category_id
        AND t.user_id = b.user_id
        AND t.type = 'expense'
        AND MONTH(t.date) = b.month
        AND YEAR(t.date) = b.year
      WHERE b.user_id = ?
        AND b.month = ?
        AND b.year = ?
      GROUP BY b.category_id
      `,
      [userId, month, year]
    );

    res.json(rows);
  } catch (err) {
    console.error("BUDGET USAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE BUDGET =================
const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Budget id is required" });
    }

    const [result] = await db.query(
      `DELETE FROM budgets WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error("DELETE BUDGET ERROR:", err);
    res.status(500).json({
      message: "Failed to delete budget",
      error: err.message,
    });
  }
};

module.exports = {
  getBudgets,
  saveBudget,
  getBudgetUsage,
  deleteBudget,
};

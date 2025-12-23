const db = require("../config/db");

// ==========================
// GET semua transaksi
// ==========================
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wallet_id, type, start_date, end_date, category_id } = req.query;

    let query = `
      SELECT t.*,
             c.name AS category_name,
             c.type AS category_type,
             c.icon AS category_icon,
             c.color AS category_color,
             w.name AS wallet_name,
             w.type AS wallet_type
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN wallets w ON t.wallet_id = w.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (wallet_id) {
      query += " AND t.wallet_id = ?";
      params.push(wallet_id);
    }

    if (type && ["income", "expense"].includes(type)) {
      query += " AND t.type = ?";
      params.push(type);
    }

    if (category_id) {
      query += " AND t.category_id = ?";
      params.push(category_id);
    }

    if (start_date) {
      query += " AND t.date >= ?";
      params.push(start_date);
    }

    if (end_date) {
      query += " AND t.date <= ?";
      params.push(end_date);
    }

    query += " ORDER BY t.date DESC, t.created_at DESC";

    const [rows] = await db.query(query, params);

    res.json(
      rows.map((r) => ({
        id: r.id,
        wallet_id: r.wallet_id,
        category_id: r.category_id,
        amount: parseFloat(r.amount),
        description: r.description,
        type: r.type,
        date: r.date,
        reference: r.reference,
        created_at: r.created_at,
        category: {
          name: r.category_name,
          type: r.category_type,
          icon: r.category_icon,
          color: r.category_color,
        },
        wallet: {
          name: r.wallet_name,
          type: r.wallet_type,
        },
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ADD transaksi
// ==========================
const addTransaction = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const { type, amount, category_id, wallet_id, description, date } =
      req.body;

    if (!type || !amount || !category_id || !wallet_id) {
      throw new Error("Data tidak lengkap");
    }

    if (!["income", "expense"].includes(type)) {
      throw new Error("Type tidak valid");
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Amount tidak valid");
    }

    const trxDate =
      typeof date === "string" && date.trim() !== ""
        ? date
        : new Date().toISOString().split("T")[0];

    await conn.beginTransaction();

    // Wallet
    const [walletRows] = await conn.query(
      "SELECT balance, type, creditLimit FROM wallets WHERE id=? AND user_id=? FOR UPDATE",
      [wallet_id, userId]
    );
    if (!walletRows.length) throw new Error("Wallet tidak ditemukan");

    const wallet = walletRows[0];
    const currentBalance = parseFloat(wallet.balance || 0);

    // Category ownership
    const [catRows] = await conn.query(
      "SELECT id FROM categories WHERE id=? AND user_id=?",
      [category_id, userId]
    );
    if (!catRows.length) throw new Error("Category tidak valid");

    // Credit validation
    if (type === "expense" && wallet.type === "credit") {
      const available = wallet.creditLimit - Math.abs(currentBalance);
      if (numericAmount > available) {
        throw new Error("Melebihi limit kredit");
      }
    }

    const reference = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log(
      "User ID:",
      userId,
      "Wallet ID:",
      wallet_id,
      "Amount:",
      numericAmount
    );
    const [result] = await conn.query(
      `INSERT INTO transactions
       (user_id,type,amount,category_id,wallet_id,description,date,reference,created_at)
       VALUES (?,?,?,?,?,?,?,?,NOW())`,
      [
        userId,
        type,
        numericAmount,
        category_id,
        wallet_id,
        description?.trim() || null,
        trxDate,
        reference,
      ]
    );
    const insertId = result.insertId; // <-- ini yang kurang
    
    const newBalance =
      type === "income"
        ? currentBalance + numericAmount
        : currentBalance - numericAmount;

    await conn.query(
      "UPDATE wallets SET balance=?, updated_at=NOW() WHERE id=? AND user_id=?",
      [newBalance, wallet_id, userId]
    );

    await conn.commit();
    res.status(201).json({
      message: "Transaction created",
      transaction: { id: insertId, wallet_id, amount: numericAmount, type },
    });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};

// ==========================
// DELETE transaksi
// ==========================
const deleteTransaction = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await conn.beginTransaction();

    const [trxRows] = await conn.query(
      "SELECT * FROM transactions WHERE id=? AND user_id=? FOR UPDATE",
      [id, userId]
    );
    if (!trxRows.length) throw new Error("Transaksi tidak ditemukan");

    const trx = trxRows[0];

    await conn.query(
      `UPDATE wallets
       SET balance = balance ${trx.type === "income" ? "-" : "+"} ?
       WHERE id=? AND user_id=?`,
      [trx.amount, trx.wallet_id, userId]
    );

    await conn.query(
      "DELETE FROM transactions WHERE id=? AND user_id=?",
      [id, userId]
    );

    await conn.commit();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};

// ==========================
// UPDATE transaksi
// ==========================
const updateTransaction = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount, category_id, wallet_id, description, date, type } =
      req.body;

    await conn.beginTransaction();

    const [oldRows] = await conn.query(
      "SELECT * FROM transactions WHERE id=? AND user_id=? FOR UPDATE",
      [id, userId]
    );
    if (!oldRows.length) throw new Error("Transaksi tidak ditemukan");

    const old = oldRows[0];

    const newAmount =
      amount !== undefined ? parseFloat(amount) : parseFloat(old.amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      throw new Error("Amount tidak valid");
    }

    const newType = type || old.type;
    const newWalletId = wallet_id || old.wallet_id;

    // rollback wallet lama
    await conn.query(
      `UPDATE wallets
       SET balance = balance ${old.type === "income" ? "-" : "+"} ?
       WHERE id=? AND user_id=?`,
      [old.amount, old.wallet_id, userId]
    );

    const [walletRows] = await conn.query(
      "SELECT balance, type, creditLimit FROM wallets WHERE id=? AND user_id=? FOR UPDATE",
      [newWalletId, userId]
    );
    if (!walletRows.length) throw new Error("Wallet tidak ditemukan");

    const wallet = walletRows[0];

    let newBalance =
      newType === "income"
        ? wallet.balance + newAmount
        : wallet.balance - newAmount;

    if (wallet.type !== "credit" && newBalance < 0) {
      throw new Error("Saldo tidak cukup");
    }

    if (wallet.type === "credit" && newType === "expense") {
      const available = wallet.creditLimit - Math.abs(wallet.balance);
      if (newAmount > available) {
        throw new Error("Melebihi limit kredit");
      }
    }

    await conn.query(
      "UPDATE wallets SET balance=?, updated_at=NOW() WHERE id=? AND user_id=?",
      [newBalance, newWalletId, userId]
    );

    await conn.query(
      `UPDATE transactions
       SET amount=?, category_id=?, wallet_id=?, description=?, date=?, type=?, updated_at=NOW()
       WHERE id=? AND user_id=?`,
      [
        newAmount,
        category_id ?? old.category_id,
        newWalletId,
        description ?? old.description,
        date ?? old.date,
        newType,
        id,
        userId,
      ]
    );

    await conn.commit();
    res.json({ message: "Transaction updated" });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
};

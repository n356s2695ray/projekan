const db = require("../config/db");

// Transfer saldo antar wallet
const transferWallet = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const { from_wallet_id, to_wallet_id, amount, description } = req.body;

    // Validasi input
    if (!from_wallet_id || !to_wallet_id || !amount || amount <= 0) {
      return res.status(400).json({ message: "Data tidak lengkap / invalid" });
    }
    if (from_wallet_id === to_wallet_id) {
      return res
        .status(400)
        .json({ message: "Wallet asal dan tujuan tidak boleh sama" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: "Amount harus berupa angka" });
    }

    await conn.beginTransaction();
    console.log("TRANSFER START:", {
      userId,
      from_wallet_id,
      to_wallet_id,
      amount: numericAmount,
    });

    // Ambil wallet asal
    const [fromRows] = await conn.query(
      "SELECT balance, type, creditLimit FROM wallets WHERE id = ? AND user_id = ? FOR UPDATE",
      [from_wallet_id, userId]
    );
    if (!fromRows.length)
      throw new Error(`Wallet asal (${from_wallet_id}) tidak ditemukan`);

    const fromBalance = parseFloat(fromRows[0].balance);
    const fromType = fromRows[0].type;
    const creditLimit = parseFloat(fromRows[0].creditLimit || 0);

    if (fromType === "credit") {
      const used = Math.abs(fromBalance);
      if (numericAmount > creditLimit - used) {
        throw new Error("Exceeds available credit limit");
      }
    } else {
      if (numericAmount > fromBalance) {
        throw new Error("Saldo wallet asal tidak cukup");
      }
    }

    // Ambil wallet tujuan
    const [toRows] = await conn.query(
      "SELECT id FROM wallets WHERE id = ? AND user_id = ? FOR UPDATE",
      [to_wallet_id, userId]
    );
    if (!toRows.length)
      throw new Error(`Wallet tujuan (${to_wallet_id}) tidak ditemukan`);

    // Hitung saldo baru
    const newFromBalance =
      fromType === "credit"
        ? fromBalance + numericAmount
        : fromBalance - numericAmount;

    // Update wallet asal
    await conn.query(
      "UPDATE wallets SET balance = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [newFromBalance, from_wallet_id, userId]
    );

    // Update wallet tujuan
    await conn.query(
      "UPDATE wallets SET balance = balance + ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [numericAmount, to_wallet_id, userId]
    );

    const reference = `TRF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Insert transaksi
    console.log("Inserting transactions...");
    const [expenseResult] = await conn.query(
      `INSERT INTO transactions
       (user_id, type, amount, wallet_id, category_id, description, reference, date, created_at)
       VALUES (?, 'expense', ?, ?, 18, ?, ?, CURDATE(), NOW())`,
      [
        userId,
        numericAmount,
        from_wallet_id,
        description || "Transfer keluar",
        reference,
      ]
    );
    console.log("Expense transaction inserted:", expenseResult);

    const [incomeResult] = await conn.query(
      `INSERT INTO transactions
       (user_id, type, amount, wallet_id, category_id, description, reference, date, created_at)
       VALUES (?, 'income', ?, ?, 17, ?, ?, CURDATE(), NOW())`,
      [
        userId,
        numericAmount,
        to_wallet_id,
        description || "Transfer masuk",
        reference,
      ]
    );
    console.log("Income transaction inserted:", incomeResult);

    await conn.commit();
    console.log("TRANSFER COMMIT SUCCESS");

    res.json({
      message: "Transfer wallet berhasil",
      reference,
      from_wallet_id,
      to_wallet_id,
      amount: numericAmount,
    });
  } catch (err) {
    await conn.rollback();
    console.error("TRANSFER WALLET ERROR:", err); // <- logging lengkap
    res.status(500).json({ message: err.message, stack: err.stack });
  } finally {
    conn.release();
  }
};

// Get semua wallet user beserta 5 transaksi terakhir
const getWallets = async (req, res) => {
  try {
    const userId = req.user.id;

    const [wallets] = await db.query(
      `SELECT id, name, balance, type, color, bankName, provider, cardNumber, creditLimit, status, currency,
              DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
              DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
       FROM wallets
       WHERE user_id = ?
       ORDER BY 
         CASE type 
           WHEN 'cash' THEN 1
           WHEN 'bank' THEN 2
           WHEN 'ewallet' THEN 3
           WHEN 'savings' THEN 4
           WHEN 'investment' THEN 5
           WHEN 'credit' THEN 6
           ELSE 7
         END,
         created_at DESC`,
      [userId]
    );

    const walletsWithTransactions = await Promise.all(
      wallets.map(async (wallet) => {
        const [transactions] = await db.query(
          `SELECT t.*, c.name as category_name, c.type as category_type
           FROM transactions t
           LEFT JOIN categories c ON t.category_id = c.id
           WHERE t.wallet_id = ? 
           ORDER BY t.date DESC, t.created_at DESC 
           LIMIT 5`,
          [wallet.id]
        );

        return {
          ...wallet,
          balance: parseFloat(wallet.balance),
          creditLimit: wallet.creditLimit
            ? parseFloat(wallet.creditLimit)
            : null,
          transactions: transactions.map((t) => ({
            ...t,
            amount: parseFloat(t.amount),
            category: t.category_name
              ? { name: t.category_name, type: t.category_type }
              : null,
          })),
        };
      })
    );

    res.json(walletsWithTransactions);
  } catch (error) {
    console.error("GET WALLETS ERROR:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch wallets", error: error.message });
  }
};

// Get wallet by ID beserta semua transaksi
const getWalletById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [walletRows] = await db.query(
      `SELECT * FROM wallets WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (!walletRows.length)
      return res.status(404).json({ message: "Wallet not found" });

    const wallet = walletRows[0];
    wallet.balance = parseFloat(wallet.balance);
    wallet.creditLimit = wallet.creditLimit
      ? parseFloat(wallet.creditLimit)
      : null;

    const [transactions] = await db.query(
      `SELECT t.*, c.name as category_name, c.type as category_type
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.wallet_id = ? 
       ORDER BY t.date DESC, t.created_at DESC 
       LIMIT 20`,
      [id]
    );

    res.json({
      ...wallet,
      transactions: transactions.map((t) => ({
        ...t,
        amount: parseFloat(t.amount),
        category: t.category_name
          ? { name: t.category_name, type: t.category_type }
          : null,
      })),
    });
  } catch (error) {
    console.error("GET WALLET BY ID ERROR:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch wallet", error: error.message });
  }
};

module.exports = {
  transferWallet,
  getWallets,
  getWalletById,
};

// services/transactionApi.js
import api from "./axios"; // pastikan ini path bener ke axios instance lo

// GET semua transaksi / berdasarkan walletId
export const getTransactions = async (walletId = null) => {
  try {
    const url = walletId ? `/transactions?wallet_id=${walletId}` : `/transactions`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
};

// ADD transaksi baru
export const addTransaction = async (data) => {
  try {
    const res = await api.post("/transactions", data);
    return res.data;
  } catch (err) {
    console.error("Error adding transaction:", err);
    throw err;
  }
};

// DELETE transaksi by ID
export const deleteTransaction = async (id) => {
  try {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting transaction:", err);
    throw err;
  }
};

// UPDATE transaksi by ID
export const updateTransaction = async (id, data) => {
  try {
    const res = await api.put(`/transactions/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating transaction:", err);
    throw err;
  }
};

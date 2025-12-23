// services/walletApi.js
import api from "./axios"; // pastikan path bener ke axios instance lo

// TRANSFER antar wallet
export const transferWallet = async (data) => {
  try {
    const res = await api.post("/wallets/transfer", data); // endpoint string relatif ke baseURL
    return res.data;
  } catch (err) {
    console.error("Error transferring wallet:", err);
    throw err;
  }
};

// GET semua wallet
export const getWallets = async () => {
  try {
    const res = await api.get("/wallets"); // endpoint string relatif ke baseURL
    return res.data;
  } catch (err) {
    console.error("Error fetching wallets:", err);
    return [];
  }
};

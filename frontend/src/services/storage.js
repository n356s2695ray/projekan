const STORAGE_KEY = "financeAppData";

// ===== Load & Save Data =====
export const loadData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ===== Inisialisasi dari data.json =====
export const initData = async () => {
  if (!loadData()) {
    try {
      const res = await fetch("/data.json");
      const initialData = await res.json();
      saveData(initialData);
      console.log("Data berhasil diinisialisasi dari data.json");
    } catch (err) {
      console.error("Gagal load data.json:", err);
    }
  }
};

// ===== Wallet Functions =====
export const getWallets = () => {
  const data = loadData();
  return data ? data.wallets : [];
};

export const addWallet = (wallet) => {
  const data = loadData() || { wallets: [], categories: [] };
  wallet.id = data.wallets.length + 1; // auto increment simple
  data.wallets.push(wallet);
  saveData(data);
};

export const updateWallet = (id, updatedWallet) => {
  const data = loadData();
  data.wallets = data.wallets.map((w) =>
    w.id === id ? { ...w, ...updatedWallet } : w
  );
  saveData(data);
};

export const deleteWallet = (id) => {
  const data = loadData();
  data.wallets = data.wallets.filter((w) => w.id !== id);
  saveData(data);
};

// ===== Category Functions =====
export const getCategories = () => {
  const data = loadData();
  return data ? data.categories : [];
};

export const addCategory = (category) => {
  const data = loadData() || { wallets: [], categories: [] };
  category.id = data.categories.length + 1;
  data.categories.push(category);
  saveData(data);
};

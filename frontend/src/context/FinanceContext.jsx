import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { getTransactions } from "../services/transactionsApi";
import { getWallets } from "../services/walletsApi";
import { getSummary, getCategory, getDaily } from "../services/dashboardApi";
import { getBudgets, saveBudget, deleteBudget } from "../services/budgetsApi";


const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // ================= STATE =================
  const [darkMode, setDarkMode] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});

  const [dashboardData, setDashboardData] = useState({
    summary: {},
    getCategoryChart: [],
    dailyChart: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ================= STATIC CATEGORIES =================
const [categoriesLoading, setCategoriesLoading] = useState(true);

const fetchCategories = useCallback(async () => {
  setCategoriesLoading(true);
  try {
    const res = await getCategory();
    if (Array.isArray(res)) {
      setCategories(
        res.map((c) => ({
          id: Number(c.id),
          name: c.name,
          type: c.type,
          color: c.color || "#000",
          icon: c.icon || "",
        }))
      );
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    setCategoriesLoading(false);
  }
}, []);

const fetchAllData = useCallback(
  async (showLoading = true) => {
    try {
      showLoading ? setLoading(true) : setRefreshing(true);

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      await fetchCategories();

      // BUDGET
      const budgetRes = await getBudgets(month, year).catch(() => []);
      const budgetMap = {};
      budgetRes.forEach((b) => {
        if (b?.category_id != null) {
          budgetMap[b.category_id] = Number(b.amount || 0);
        }
      });
      setBudgets(budgetMap);

      // WALLETS
      const walletsRes = await getWallets().catch(() => []);
      setWallets(
        (walletsRes || []).map((w) => ({
          ...w,
          id: Number(w.id),
          balance: Number(w.balance) || 0,
          creditLimit: w.creditLimit ? Number(w.creditLimit) : null,
        }))
      );

      // TRANSACTIONS
      const trxRes = await getTransactions().catch(() => []);
      setTransactions(
        trxRes.map((t) => ({
          ...t,
          id: Number(t.id),
          amount: Number(t.amount) || 0,
          wallet_id: Number(t.wallet_id),
          category_id: Number(t.category_id),
        }))
      );

      // DASHBOARD
      const [summaryRes, dailyChartRes] = await Promise.all([
        getSummary().catch(() => ({})),
        getDaily().catch(() => []),
      ]);

      // Jangan langsung pakai getCategoryData di sini, panggil setelah transactions & categories sudah set
      setDashboardData({
        summary: summaryRes,
        categoryChart: [], // sementara kosong
        dailyChart: dailyChartRes,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [fetchCategories] // Hapus transactions & categories
);

  useEffect(() => {
    if (!transactions.length || !categories.length) return;
    setDashboardData((prev) => ({
      ...prev,
      categoryChart: getCategoryData("expense"),
    }));
  }, [transactions, categories]);


useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return; // ⬅️ STOP FETCH KALAU BELUM LOGIN

  fetchAllData();
}, [fetchAllData]);

const getCategoryData = (type = "expense") => {
  if (!categories.length) return [];

  const map = {};

  transactions.forEach((trx) => {
    if (trx.type !== type) return;

    const category = categories.find((c) => c.id === trx.category_id);

    const key = category?.name || "Other";
    map[key] = (map[key] || 0) + trx.amount;
  });

  return Object.entries(map).map(([name, total]) => ({
    name,
    total,
  }));
};


// ================= GET MONTHLY DATA =================
const getMonthlyData = (timeRange = "month") => {
  const monthlyMap = {};

  transactions.forEach((trx) => {
    const date = new Date(trx.date);
    const month = date.toLocaleString("en-US", { month: "short" });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (trx.type === "income") {
      monthlyMap[month].income += trx.amount;
    }

    if (trx.type === "expense") {
      monthlyMap[month].expense += trx.amount;
    }
  });

  const monthsOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthsOrder.map((m) => ({
    month: m,
    income: monthlyMap[m]?.income || 0,
    expense: monthlyMap[m]?.expense || 0,
  }));
};


  // ================= MUTATION HELPER =================
  const afterMutation = useCallback(async () => {
    await fetchAllData(false);
  }, [fetchAllData]);

  // ================= TRANSACTION STATE (LOCAL ONLY) =================
const addTransaction = useCallback((transaction) => {
  if (!transaction) return;

  setTransactions((prev) => [transaction, ...prev]);

  setWallets((prevWallets) =>
    prevWallets.map((w) => {
      if (Number(w.id) !== Number(transaction.wallet_id)) return w;

      if (transaction.type === "income") {
        return { ...w, balance: w.balance + transaction.amount };
      }

      if (transaction.type === "expense") {
        return { ...w, balance: w.balance - transaction.amount };
      }

      return w;
    })
  );
}, []);

const removeTransaction = useCallback((id) => {
  setTransactions((prev) => {
    const trx = prev.find((t) => t.id === id);
    if (!trx) return prev;

    setWallets((wallets) =>
      wallets.map((w) => {
        if (w.id !== trx.wallet_id) return w;

        if (trx.type === "income") {
          return { ...w, balance: w.balance - trx.amount };
        }

        if (trx.type === "expense") {
          return { ...w, balance: w.balance + trx.amount };
        }

        return w;
      })
    );

    return prev.filter((t) => t.id !== id);
  });
}, []);

  // ================= CALCULATION (DISPLAY ONLY) =================
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount || 0), 0);


const walletTotals = wallets.reduce(
  (acc, w) => {
    const bal = Number(w?.balance ?? 0);

    if (w.type === "credit") {
  acc.creditUsed += Math.abs(bal);
  acc.totalBalance -= Math.abs(bal);
} else {
  acc.totalAssets += bal;
  acc.totalBalance += bal;
}


    return acc;
  },
  {
    totalBalance: 0,
    totalAssets: 0,
    creditUsed: 0,
  }
);

  // ================= BUDGET =================
  const getBudgetUsage = useCallback(
    (categoryId) => {
      const budget = Number(budgets[categoryId] || 0);
      const now = new Date();

      const spent = transactions
        .filter(
          (t) =>
            t.type === "expense" &&
            t.category_id === Number(categoryId) &&
            new Date(t.date).getMonth() === now.getMonth() &&
            new Date(t.date).getFullYear() === now.getFullYear()
        )
        .reduce((s, t) => s + t.amount, 0);

      return {
        spent,
        budget,
        remaining: Math.max(budget - spent, 0),
        percentage: budget ? Math.min((spent / budget) * 100, 100) : 0,
      };
    },
    [budgets, transactions]
  );

  const addBudget = useCallback(
    async (data) => {
      await saveBudget(data);
      await afterMutation();
    },
    [afterMutation]
  );


const removeBudget = async (categoryId) => {
  try {
    await deleteBudget(categoryId);
    await afterMutation(); // refresh semua data
  } catch (error) {
    console.error("Error deleting budget:", error);
  }
};

  // ================= PROVIDER =================
  return (
    <FinanceContext.Provider
      value={{
        darkMode,
        setDarkMode,

        getMonthlyData,
        getCategoryData,

        wallets,
        transactions,
        categories,
        budgets,

        loading,
        refreshing,
        dashboardData,

        totalIncome,
        totalExpense,
        walletTotals,
        addTransaction,
        removeTransaction,

        afterMutation,

        getBudgetUsage,
        addBudget,
        removeBudget,

        fetchAllData,
        categoriesLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

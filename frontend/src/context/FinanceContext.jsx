import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  getTransactions,
  deleteTransaction as deleteTransactionApi,
  updateTransaction as updateTransactionApi,
} from "../services/transactionsApi";
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
      const parsed = res.map((c) => ({
        id: Number(c.id), // ⬅️ PENTING
        name: c.name,
        type: c.type,
        color: c.color || "#000",
        icon: c.icon || "",
      }));
      setCategories(parsed);
      return parsed; // ⬅️ PENTING
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
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

      // ✅ FETCH CATEGORY SEKALI
      const fetchedCategories = await fetchCategories();

      // BUDGET
      const budgetRes = await getBudgets(month, year).catch(() => []);
      const budgetMap = {};
      budgetRes.forEach((b) => {
        if (b?.category_id != null) {
          budgetMap[Number(b.category_id)] = Number(b.amount || 0);
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
        trxRes.map((t) => {
          const categoryId = Number(t.category_id);

          const category = fetchedCategories.find((c) => c.id === categoryId);

          return {
            ...t,
            id: Number(t.id),
            amount: Number(t.amount) || 0,
            wallet_id: Number(t.wallet_id),
            category_id: categoryId,
            category_name:
              category?.name || t.category?.name || "Uncategorized",
          };

        })
      );

      // DASHBOARD
      const [summaryRes, dailyChartRes] = await Promise.all([
        getSummary().catch(() => ({})),
        getDaily().catch(() => []),
      ]);

      setDashboardData({
        summary: summaryRes,
        categoryChart: [],
        dailyChart: dailyChartRes,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [fetchCategories]
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

const getCategoryData = useCallback(
  (type = "expense") => {
    const map = {};

    transactions.forEach((trx) => {
      if (trx.type?.toLowerCase() !== type) return;

      const key =
        categories.find((c) => c.id === trx.category_id)?.name ||
        trx.category_name ||
        "Uncategorized";

      map[key] = (map[key] || 0) + trx.amount;
    });

    return Object.entries(map).map(([name, total]) => ({
      name,
      total,
    }));
  },
  [transactions, categories]
);


// ================= GET MONTHLY DATA =================
const getMonthlyData = (timeRange = "month") => {
  const monthlyMap = {};

  transactions.forEach((trx) => {
    const date = new Date(trx.date);
    const month = date.toLocaleString("en-US", { month: "short" });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (trx.type?.toLowerCase() === "income") {
  monthlyMap[month].income += trx.amount;
  }

  if (trx.type?.toLowerCase() === "expense") {
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
const addTransaction = useCallback(
  (transaction) => {
    if (!categories.length) return;

    const category = categories.find(
      (c) => Number(c.id) === Number(transaction.category_id)
    );

    setTransactions((prev) => [
      {
        ...transaction,
        category_name: category?.name || "Uncategorized",
      },
      ...prev,
    ]);
  },
  [categories]
);

const updateTransaction = useCallback(
  async (id, data) => {
    await updateTransactionApi(id, data);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              id,
              amount: Number(data.amount),
              category_id: Number(data.category_id),
              category_name:
                categories.find(
                  (c) => c.id === Number(data.category_id)
                )?.name || "Uncategorized",
            }
          : t
      )
    );
  },
  [categories]
);

const removeTransaction = useCallback(async (id) => {
  // 1. DELETE KE BACKEND
  await deleteTransactionApi(id);

  // 2. UPDATE STATE
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
        updateTransaction,

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

const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  PieChart,
  Calendar,
  Bell,
  Target,
  AlertCircle,
  BarChart3,
  LineChart,
  Users,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  Download,
  Filter,
  MoreVertical,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp as ArrowTrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import CardBalance from "../components/CardBalance";
import ChartSpending from "../components/ChartSpending";
import TransactionTable from "../components/TransactionTable";
import CurrencyConverter from "../components/CurrencyConverter";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

const Dashboard = () => {
  // State untuk dark mode dari manager
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.text())
      .then((data) => {
        console.log("✅ Backend Railway:", data);
      })
      .catch((err) => {
        console.error("❌ Backend error:", err);
      });
  }, []);


  const {
    budgets = {},
    categories = [],
    transactions = [],
    totalIncome = 0,
    totalExpense = 0,
    walletTotals = {},
    dashboardData = {},
  } = useFinance();

  const [timeRange, setTimeRange] = useState("month");
  const [showBalance, setShowBalance] = useState(true);
  const [showFullChart, setShowFullChart] = useState(false);
  const [currencyCollapsed, setCurrencyCollapsed] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "user@example.com",
    role: "Premium User",
  };

  // Calculate budget usage dengan useMemo untuk optimasi
  const calculateBudgetUsage = useMemo(
    () => (categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category)
        return { spent: 0, budget: 0, percentage: 0, status: "good" };

      const spent = transactions
        .filter((t) => t.category_id === categoryId && t.type === "expense")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const budget = budgets[categoryId] || 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;

      return {
        spent,
        budget,
        percentage,
        status:
          percentage >= 100 ? "over" : percentage >= 80 ? "warning" : "good",
      };
    },
    [transactions, budgets, categories]
  );

  // Filter budget entries yang memiliki nilai budget
  const budgetEntries = useMemo(() => {
    return Object.entries(budgets || {})
      .filter(([, budget]) => budget > 0)
      .map(([categoryId, budget]) => {
        const category = categories.find((c) => c.id === Number(categoryId));
        const usage = calculateBudgetUsage(Number(categoryId));
        return { categoryId: Number(categoryId), budget, category, usage };
      })
      .filter((item) => item.category) // Hanya yang punya kategori
      .slice(0, 3); // Hanya tampilkan 3 item
  }, [budgets, categories, calculateBudgetUsage]);

  // Quick stats data dengan useMemo
  const quickStats = useMemo(
    () => [
      {
        title: "Total Income",
        value: `Rp ${totalIncome.toLocaleString("id-ID")}`,
        change: "+5.2%",
        isPositive: true,
        icon: TrendingUp,
        color: "from-green-500 to-emerald-500",
        description: "This month",
      },
      {
        title: "Total Expense",
        value: `Rp ${totalExpense.toLocaleString("id-ID")}`,
        change: "-3.1%",
        isPositive: false,
        icon: TrendingDown,
        color: "from-red-500 to-rose-500",
        description: "From last month",
      },
      {
        title: "Net Balance",
        value: `Rp ${(totalIncome - totalExpense).toLocaleString("id-ID")}`,
        change: totalIncome > totalExpense ? "+8.5%" : "-2.3%",
        isPositive: totalIncome > totalExpense,
        icon: DollarSign,
        color: "from-blue-500 to-cyan-500",
        description: "Monthly net",
      },
      {
        title: "Active Budgets",
        value: `${
          Object.keys(budgets).filter((key) => budgets[key] > 0).length
        }`,
        change: "+2",
        isPositive: true,
        icon: Target,
        color: "from-purple-500 to-violet-500",
        description: "Total categories",
      },
    ],
    [totalIncome, totalExpense, budgets]
  );

  // Recent activities
  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        action: "Transaction Added",
        detail: transactions[0]
          ? `${transactions[0].description || "Transaction"} - Rp ${(
              transactions[0].amount || 0
            ).toLocaleString("id-ID")}`
          : "No recent transactions",
        time: "10 min ago",
        icon: CreditCard,
        color: "text-green-500",
        bgColor: "bg-green-500/20",
      },
      {
        id: 2,
        action: "Budget Updated",
        detail: budgetEntries[0]
          ? `${budgetEntries[0].category?.name} category updated`
          : "No budget set",
        time: "1 hour ago",
        icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-500/20",
      },
      {
        id: 3,
        action: "Account Synced",
        detail: "All accounts updated",
        time: "2 hours ago",
        icon: Wallet,
        color: "text-purple-500",
        bgColor: "bg-purple-500/20",
      },
      {
        id: 4,
        action: "Report Generated",
        detail: "Monthly spending report",
        time: "1 day ago",
        icon: BarChart3,
        color: "text-amber-500",
        bgColor: "bg-amber-500/20",
      },
    ],
    [transactions, budgetEntries]
  );

  // Quick Actions
  const quickActions = [
    {
      icon: Plus,
      label: "Add Income",
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-500/20",
      action: () => console.log("Add Income"),
    },
    {
      icon: CreditCard,
      label: "Add Expense",
      color: "from-red-500 to-rose-500",
      bg: "bg-red-500/20",
      action: () => console.log("Add Expense"),
    },
    {
      icon: Target,
      label: "Set Budget",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/20",
      action: () => console.log("Set Budget"),
    },
    {
      icon: BarChart3,
      label: "View Reports",
      color: "from-purple-500 to-violet-500",
      bg: "bg-purple-500/20",
      action: () => console.log("View Reports"),
    },
  ];

  // Format date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });



  return (
    <div className="min-h-screen pb-6">
      {/* Header dengan Welcome & Date */}
      <div className="sticky top-0 z-20 backdrop-blur-sm">
        <div className={`px-4 sm:px-6 py-4 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    darkMode
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {user.role || "USER"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {user.name}
                </span>{" "}
                👋
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-sm sm:text-base mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Here's your financial overview for {currentDate}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm ${
                darkMode
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white border border-gray-200"
              } shadow-lg`}
            >
              <Calendar
                className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
              />
              <div>
                <p
                  className={`font-semibold text-sm sm:text-base ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentDate.split(",")[0]}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {currentDate.split(",")[1]}, {currentDate.split(",")[2]}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Balance Cards dengan Toggle */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg sm:text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Account Overview
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
            </button>
          </div>
          <CardBalance showBalance={showBalance} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-900/20"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-blue-500/10"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-xl blur-lg" style={{
                    backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                  }}></div>
                  <div className={`p-2.5 sm:p-3 rounded-xl backdrop-blur-sm ${
                    darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                  }`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.isPositive
                      ? darkMode
                        ? "bg-green-900/30 text-green-400 border border-green-800/50"
                        : "bg-green-100 text-green-700 border border-green-200"
                      : darkMode
                      ? "bg-red-900/30 text-red-400 border border-red-800/50"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowTrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>

              <div>
                <p
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-1`}
                >
                  {stat.value}
                </p>
                <p
                  className={`font-medium text-sm sm:text-base ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area - Charts, Budget, Currency */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section - Lebih besar (2 kolom) */}
          <div className={`lg:col-span-2 rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } shadow-xl`}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}>
                    Monthly Spending Overview
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Track your spending patterns and trends
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex rounded-lg overflow-hidden p-1 ${
                    darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-gray-100 border border-gray-200"
                  }`}>
                    {["week", "month", "quarter", "year"].map((range) => (
                      <motion.button
                        key={range}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm capitalize transition-all ${
                          timeRange === range
                            ? darkMode
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : darkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-700/50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        {range}
                      </motion.button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowFullChart(!showFullChart)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {showFullChart ? (
                      <ChevronDown className="w-4 h-4 rotate-180" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Chart Container - Ukuran diperbesar */}
              <div className={`${showFullChart ? 'h-[400px]' : 'h-[350px]'} rounded-xl p-4 transition-all duration-300 ${
                darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <ChartSpending timeRange={timeRange} height={showFullChart ? 380 : 330} />
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Expense</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Net Balance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Kanan - Budget & Currency */}
          <div className="space-y-6">
            {/* Budget Overview - Diperkecil */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
                : "bg-white border border-gray-200"
            } shadow-xl`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>
                      Budget Overview
                    </h3>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Track spending against budgets
                    </p>
                  </div>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                  {budgetEntries.length > 0 ? (
                    budgetEntries.map((item, index) => {
                      const { category, usage } = item;
                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              }`}>
                                <span className="text-sm">{category.icon || "💰"}</span>
                              </div>
                              <div className="min-w-0">
                                <p className={`font-medium text-sm truncate ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}>
                                  {category.name}
                                </p>
                                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
                                  Rp {usage.spent.toLocaleString('id-ID')} / Rp {usage.budget.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <span className={`text-sm font-semibold ${
                              usage.status === "over" ? "text-red-500" : 
                              usage.status === "warning" ? "text-amber-500" : "text-green-500"
                            }`}>
                              {usage.percentage.toFixed(0)}%
                            </span>
                          </div>
                          
                          <div className={`h-1.5 rounded-full overflow-hidden ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}>
                            <div
                              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                              className={`h-full rounded-full ${
                                usage.status === "over" ? "bg-gradient-to-r from-red-500 to-pink-500" :
                                usage.status === "warning" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                                "bg-gradient-to-r from-green-500 to-emerald-500"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6">
                      <Target className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                        No budgets set yet
                      </p>
                      <button className={`text-xs px-3 py-1.5 rounded-lg ${
                        darkMode 
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}>
                        Create Budget
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Currency Converter - Diperkecil */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
                : "bg-white border border-gray-200"
            } shadow-xl`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>
                      Currency Converter
                    </h3>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Real-time exchange rates
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrencyCollapsed(!currencyCollapsed)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      currencyCollapsed ? "rotate-180" : ""
                    }`} />
                  </button>
                </div>

                {!currencyCollapsed && (
                  <div className="space-y-4">
                    <CurrencyConverter compact={true} />
                    <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"} flex items-center gap-2`}>
                      <RefreshCw className="w-3 h-3" />
                      <span>Rates updated: Today 12:00 UTC</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
                : "bg-white border border-gray-200"
            } shadow-xl`}>
              <div className="p-4 sm:p-5">
                <h3 className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action.action}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300
                          ${
                            darkMode
                              ? "bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className={`p-2 rounded-full ${action.bg}`}>
                          <div className={`bg-gradient-to-br ${action.color} bg-clip-text text-transparent`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <span className={`font-medium text-xs text-center ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {action.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } shadow-xl`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Recent Activity
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Latest updates from your account
                  </p>
                </div>
                <div className="relative">
                  <Bell className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
              </div>

              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        darkMode
                          ? "hover:bg-gray-800/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {activity.action}
                        </p>
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {activity.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className={`w-3 h-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                        <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Transactions - Header saja */}
          <div className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } shadow-xl`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Recent Transactions
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Latest financial activities
                  </p>
                </div>
                <button className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <TransactionTable limit={3} />
            </div>
          </div>
        </div>

        {/* Bottom Stats - Responsif */}
        <div className={`rounded-2xl p-4 sm:p-6 ${
          darkMode
            ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30"
            : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
        }`}>
          <h3 className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Summary Stats
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {walletTotals?.totalWallets || 0}
              </div>
              <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Wallets
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {categories.length || 0}
              </div>
              <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {transactions.length || 0}
              </div>
              <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Transactions
              </div>
            </div>
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {Object.keys(budgets).filter(key => budgets[key] > 0).length || 0}
              </div>
              <div className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Active Budgets
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
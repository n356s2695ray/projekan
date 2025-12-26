// const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  Calendar,
  Bell,
  Target,
  BarChart3,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
  ChevronDown,
  RefreshCw,
  Coins,
  Banknote,
  Zap,
  Shield,
  Users,
  PiggyBank,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CardBalance from "../components/CardBalance";
import ChartSpending from "../components/ChartSpending";
import CurrencyConverter from "../components/CurrencyConverter";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

// Komponen FloatingMoney untuk animasi uang melayang
const FloatingMoney = ({ type = "income", isActive = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, [isActive]);

  const color = type === "income" ? "text-emerald-400" : 
                type === "expense" ? "text-rose-400" : 
                "text-blue-400";

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${color}`}
            style={{
              left: `${particle.x}%`,
              top: '100%',
            }}
            initial={{
              y: 0,
              opacity: 0,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              y: -window.innerHeight * 1.5,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: particle.rotation + 720,
              x: particle.x + (Math.random() * 100 - 50),
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
            exit={{ opacity: 0 }}
          >
            {type === "income" ? (
              <Coins style={{ width: particle.size, height: particle.size }} />
            ) : type === "expense" ? (
              <Banknote style={{ width: particle.size, height: particle.size }} />
            ) : (
              <DollarSign style={{ width: particle.size, height: particle.size }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Komponen AnimatedCounter untuk animasi angka
const AnimatedCounter = ({ value, duration = 1.5, prefix = "Rp " }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      const start = prevValue.current;
      const end = value;
      const increment = (end - start) / (duration * 60);
      let current = start;
      let frameId;

      const animate = () => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          cancelAnimationFrame(frameId);
        } else {
          frameId = requestAnimationFrame(animate);
        }
        setDisplayValue(Math.floor(current));
      };

      frameId = requestAnimationFrame(animate);
      prevValue.current = end;

      return () => cancelAnimationFrame(frameId);
    }
  }, [value, duration]);

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString('id-ID');
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="inline-block"
    >
      {prefix}{formatNumber(displayValue)}
    </motion.span>
  );
};

const Dashboard = () => {
  // State untuk dark mode dari manager
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const [timeRange, setTimeRange] = useState("month");
  const [showBalance, setShowBalance] = useState(true);
  const [showFullChart, setShowFullChart] = useState(false);
  const [currencyCollapsed, setCurrencyCollapsed] = useState(false);
  const [activeMoneyAnimation, setActiveMoneyAnimation] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const {
    budgets = {},
    categories = [],
    transactions = [],
    totalIncome = 0,
    totalExpense = 0,
    walletTotals = {},
  } = useFinance();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    email: "user@example.com",
    role: "Premium User",
  };

  // Trigger animasi uang
  const triggerMoneyAnimation = (type) => {
    setActiveMoneyAnimation(type);
    setTimeout(() => setActiveMoneyAnimation(null), 100);
  };

  // Calculate budget usage
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

  // Filter budget entries
  const budgetEntries = useMemo(() => {
    return Object.entries(budgets || {})
      .filter(([, budget]) => budget > 0)
      .map(([categoryId, budget]) => {
        const category = categories.find((c) => c.id === Number(categoryId));
        const usage = calculateBudgetUsage(Number(categoryId));
        return { categoryId: Number(categoryId), budget, category, usage };
      })
      .filter((item) => item.category)
      .slice(0, 3);
  }, [budgets, categories, calculateBudgetUsage]);

  // Recent activities
  const recentActivities = useMemo(
    () => [
      {
        id: 1,
        action: "Income Added",
        detail: `Rp ${(totalIncome * 0.3).toLocaleString('id-ID')} added`,
        time: "10 min ago",
        icon: TrendingUp,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/20",
      },
      {
        id: 2,
        action: "Expense Recorded",
        detail: `Rp ${(totalExpense * 0.2).toLocaleString('id-ID')} spent`,
        time: "1 hour ago",
        icon: TrendingDown,
        color: "text-rose-500",
        bgColor: "bg-rose-500/20",
      },
      {
        id: 3,
        action: "Budget Updated",
        detail: budgetEntries[0]
          ? `${budgetEntries[0].category?.name} category updated`
          : "No budget set",
        time: "2 hours ago",
        icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-500/20",
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
    [totalIncome, totalExpense, budgetEntries]
  );

  // Quick Actions
  const quickActions = [
    {
      icon: Plus,
      label: "Add Income",
      color: "from-emerald-400 to-green-500",
      bg: "bg-emerald-500/20",
      action: () => {
        console.log("Add Income");
        triggerMoneyAnimation("income");
      },
    },
    {
      icon: CreditCard,
      label: "Add Expense",
      color: "from-rose-400 to-red-500",
      bg: "bg-rose-500/20",
      action: () => {
        console.log("Add Expense");
        triggerMoneyAnimation("expense");
      },
    },
    {
      icon: Target,
      label: "Set Budget",
      color: "from-blue-400 to-cyan-500",
      bg: "bg-blue-500/20",
      action: () => {
        console.log("Set Budget");
        triggerMoneyAnimation("balance");
      },
    },
    {
      icon: BarChart3,
      label: "View Reports",
      color: "from-violet-400 to-purple-500",
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
    <div className="min-h-screen pb-6 overflow-x-hidden">
      {/* Animasi Money Particles */}
      <FloatingMoney type={activeMoneyAnimation} isActive={!!activeMoneyAnimation} />

      {/* Header dengan Welcome & Date */}
      <div className="sticky top-0 z-30 backdrop-blur-xl">
        <div className={`px-4 sm:px-6 lg:px-8 py-4 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="flex-1 min-w-0">
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
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm flex-shrink-0 ${
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

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Account Overview dengan Animasi WOW */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Account Overview
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBalance(!showBalance)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-300 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
            </motion.button>
          </div>
          
          {/* Card Balance dengan efek khusus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <CardBalance showBalance={showBalance} />
            
            {/* Floating coins animation around CardBalance */}
            <AnimatePresence>
              {showBalance && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${i % 2 === 0 ? 'text-emerald-400' : 'text-amber-400'}`}
                      style={{
                        left: `${20 + i * 20}%`,
                        top: '-20px',
                      }}
                      initial={{ y: 0, opacity: 0, scale: 0 }}
                      animate={{
                        y: [-20, 0, -20],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        rotate: 360,
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Coins className="w-4 h-4" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className={`lg:col-span-2 rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-gray-900/50 border border-gray-700/50"
              : "bg-white border border-gray-200"
          } shadow-xl`}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-2`}>
                    Financial Overview
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
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
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
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullChart ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Chart Container */}
              <div className={`${showFullChart ? 'h-[400px]' : 'h-[300px] sm:h-[350px]'} rounded-xl p-4 transition-all duration-300 ${
                darkMode ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <ChartSpending timeRange={timeRange} height={showFullChart ? 380 : 330} />
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Expense</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Net Balance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Kanan */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-900/50 border border-gray-700/50"
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
                  <button className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                  {budgetEntries.length > 0 ? (
                    budgetEntries.map((item, index) => {
                      const { category, usage } = item;
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
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
                            <motion.span 
                              whileHover={{ scale: 1.1 }}
                              className={`text-sm font-semibold ${
                                usage.status === "over" ? "text-rose-500" : 
                                usage.status === "warning" ? "text-amber-500" : "text-emerald-500"
                              }`}
                            >
                              {usage.percentage.toFixed(0)}%
                            </motion.span>
                          </div>
                          
                          <div className={`h-2 rounded-full overflow-hidden ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(usage.percentage, 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className={`h-full rounded-full ${
                                usage.status === "over" ? "bg-gradient-to-r from-rose-500 to-pink-500" :
                                usage.status === "warning" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                                "bg-gradient-to-r from-emerald-500 to-green-500"
                              }`}
                            />
                          </div>
                        </motion.div>
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

            {/* Currency Converter */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-900/50 border border-gray-700/50"
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

                <AnimatePresence>
                  {!currencyCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <CurrencyConverter compact={true} />
                      <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-600"} flex items-center gap-2`}>
                        <RefreshCw className="w-3 h-3" />
                        <span>Rates updated: Today 12:00 UTC</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-gray-900/50 border border-gray-700/50"
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
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action.action}
                        className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300
                          ${
                            darkMode
                              ? "bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600"
                              : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <motion.div 
                          className={`p-2 rounded-full ${action.bg}`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className={`bg-gradient-to-br ${action.color} bg-clip-text text-transparent`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </motion.div>
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

        {/* Recent Activity */}
        <div className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-gray-900/50 border border-gray-700/50"
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
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </div>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                      darkMode
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </motion.div>
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={`rounded-2xl p-4 sm:p-6 ${
          darkMode
            ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30"
            : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
        }`}>
          <h3 className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Financial Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Wallets", value: walletTotals?.totalWallets || 0, icon: Wallet },
              { label: "Categories", value: categories.length || 0, icon: CreditCard },
              { label: "Transactions", value: transactions.length || 0, icon: BarChart3 },
              { label: "Active Budgets", value: Object.keys(budgets).filter(key => budgets[key] > 0).length || 0, icon: Target },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className={`text-xl sm:text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    <AnimatedCounter value={stat.value} duration={1} prefix="" />
                  </div>
                  <div className={`text-xs sm:text-sm flex items-center justify-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <Icon className="w-3 h-3" />
                    <span>{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
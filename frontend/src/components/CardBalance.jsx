import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Eye, 
  EyeOff,
  Shield,
  Building,
  CreditCard,
  ChevronRight,
  PieChart,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  User,
  CreditCard as Card,
  Shield as Security,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "../context/FinanceContext";

const CardBalance = () => {
  const { walletTotals, totalIncome, totalExpense, darkMode } = useFinance();
  const [showBalance, setShowBalance] = useState(true);
  const [isHovered, setIsHovered] = useState(null);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [balanceValue, setBalanceValue] = useState(walletTotals?.totalBalance ?? 0);

  const formatCurrency = (amount) => {
    const value = Number(amount);
    if (isNaN(value)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace("IDR", "Rp");
  };

  useEffect(() => {
    if (walletTotals?.totalBalance !== balanceValue) {
      setBalanceAnimation(true);
      setBalanceValue(walletTotals?.totalBalance ?? 0);
      const timer = setTimeout(() => setBalanceAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [walletTotals?.totalBalance]);

  const colorPalette = {
    dark: {
      balance: {
        bg: 'linear-gradient(145deg, #1a1b2e 0%, #0f1524 100%)',
        border: 'rgba(99, 102, 241, 0.25)',
        primary: '#6366f1',
        glow: 'rgba(99, 102, 241, 0.15)'
      },
      income: {
        bg: 'linear-gradient(145deg, #0d2b1e 0%, #071a14 100%)',
        border: 'rgba(16, 185, 129, 0.25)',
        primary: '#10b981',
        glow: 'rgba(16, 185, 129, 0.15)'
      },
      expense: {
        bg: 'linear-gradient(145deg, #2d0f14 0%, #1a0a0d 100%)',
        border: 'rgba(239, 68, 68, 0.25)',
        primary: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.15)'
      },
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        muted: '#94a3b8'
      }
    },
    light: {
      balance: {
        bg: 'linear-gradient(145deg, #f0f4ff 0%, #e6edff 100%)',
        border: 'rgba(99, 102, 241, 0.2)',
        primary: '#4f46e5',
        glow: 'rgba(99, 102, 241, 0.1)'
      },
      income: {
        bg: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
        border: 'rgba(16, 185, 129, 0.2)',
        primary: '#059669',
        glow: 'rgba(16, 185, 129, 0.1)'
      },
      expense: {
        bg: 'linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%)',
        border: 'rgba(239, 68, 68, 0.2)',
        primary: '#dc2626',
        glow: 'rgba(239, 68, 68, 0.1)'
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b'
      }
    }
  };

  const colors = darkMode ? colorPalette.dark : colorPalette.light;

  return (
    <div className="space-y-6">
      {/* Welcome Header - Compact */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text.primary }}>
            Welcome back, <span className="text-gradient bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Ican</span>
          </h1>
          <p className="text-sm md:text-base mt-1" style={{ color: colors.text.muted }}>
            Here's your financial overview for {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" 
            style={{ 
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${colors.text.muted}20`
            }}>
            <Clock className="w-4 h-4" style={{ color: colors.text.muted }} />
            <span className="text-sm" style={{ color: colors.text.muted }}>Live Updates</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg font-medium text-sm"
            style={{
              background: colors.balance.primary,
              color: 'white'
            }}
          >
            View Report
          </motion.button>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.005 }}
          className="relative overflow-hidden rounded-xl p-5 group"
          style={{
            background: colors.balance.bg,
            border: `1px solid ${colors.balance.border}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: colors.balance.primary + '20' }}>
                <Wallet className="w-4 h-4" style={{ color: colors.balance.primary }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80" 
                  style={{ color: colors.text.secondary }}>
                  Total Balance
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3" style={{ color: colors.text.muted }} />
                  <span className="text-xs opacity-80" style={{ color: colors.text.muted }}>Secure</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1.5 rounded-lg hover:bg-opacity-20 transition-colors"
              style={{ background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }}
            >
              {showBalance ? 
                <EyeOff className="w-4 h-4" style={{ color: colors.text.muted }} /> : 
                <Eye className="w-4 h-4" style={{ color: colors.text.muted }} />
              }
            </button>
          </div>

          {/* Balance Amount */}
          <div className="mb-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={showBalance ? "visible" : "hidden"}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-2xl md:text-3xl font-bold mb-2 font-mono tracking-tight"
                style={{ color: colors.balance.primary }}
              >
                {showBalance ? formatCurrency(balanceValue) : "••••••••"}
              </motion.h2>
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.income.primary }} />
              </motion.div>
              <span className="text-sm font-medium" style={{ color: colors.income.primary }}>+12.5% from last month</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t" 
            style={{ borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.income.primary }} />
              <span className="text-xs" style={{ color: colors.text.muted }}>Active • Live</span>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium group"
              style={{ color: colors.balance.primary }}>
              Details
              <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.005 }}
          className="relative overflow-hidden rounded-xl p-5"
          style={{
            background: colors.income.bg,
            border: `1px solid ${colors.income.border}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: colors.income.primary + '20' }}>
                <ArrowUpRight className="w-4 h-4" style={{ color: colors.income.primary }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80" 
                  style={{ color: colors.text.secondary }}>
                  Total Income
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" style={{ color: colors.text.muted }} />
                  <span className="text-xs opacity-80" style={{ color: colors.text.muted }}>This month</span>
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ 
                background: colors.income.primary + '20',
                color: colors.income.primary
              }}>
              +25%
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-bold mb-2 font-mono tracking-tight"
              style={{ color: colors.income.primary }}>
              {formatCurrency(totalIncome)}
            </h3>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5" style={{ color: colors.text.muted }} />
              <span className="text-sm" style={{ color: colors.text.muted }}>15 transactions</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: colors.text.muted }}>Target progress</span>
              <span className="font-semibold" style={{ color: colors.income.primary }}>85%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ 
                  background: colors.income.primary,
                  width: '85%'
                }} />
            </div>
          </div>
        </motion.div>

        {/* Expense Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.005 }}
          className="relative overflow-hidden rounded-xl p-5"
          style={{
            background: colors.expense.bg,
            border: `1px solid ${colors.expense.border}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: colors.expense.primary + '20' }}>
                <ArrowDownRight className="w-4 h-4" style={{ color: colors.expense.primary }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80" 
                  style={{ color: colors.text.secondary }}>
                  Total Expense
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" style={{ color: colors.text.muted }} />
                  <span className="text-xs opacity-80" style={{ color: colors.text.muted }}>This month</span>
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ 
                background: colors.expense.primary + '20',
                color: colors.expense.primary
              }}>
              -8%
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-bold mb-2 font-mono tracking-tight"
              style={{ color: colors.expense.primary }}>
              {formatCurrency(totalExpense)}
            </h3>
            <div className="flex items-center gap-2">
              <PieChart className="w-3.5 h-3.5" style={{ color: colors.text.muted }} />
              <span className="text-sm" style={{ color: colors.text.muted }}>22 transactions</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: colors.text.muted }}>Spending trend</span>
              <span className="font-semibold" style={{ color: colors.expense.primary }}>65%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ 
                  background: colors.expense.primary,
                  width: '65%'
                }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Menu Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
      >
        {[
          { icon: <User className="w-5 h-5" />, label: 'My Profile', desc: 'Personal information' },
          { icon: <Card className="w-5 h-5" />, label: 'My Wallet', desc: 'Manage balances' },
          { icon: <CreditCard className="w-5 h-5" />, label: 'Billing', desc: 'Payment methods' },
          { icon: <Security className="w-5 h-5" />, label: 'Security', desc: 'Privacy & protection' },
        ].map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-xl text-left transition-all group"
            style={{
              background: darkMode 
                ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'
                : 'linear-gradient(145deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.01))',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg group-hover:scale-110 transition-transform"
                style={{ 
                  background: colors.balance.primary + '15',
                  color: colors.balance.primary
                }}>
                {item.icon}
              </div>
              <span className="font-semibold text-sm" style={{ color: colors.text.primary }}>
                {item.label}
              </span>
            </div>
            <p className="text-xs opacity-70" style={{ color: colors.text.muted }}>
              {item.desc}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default CardBalance;
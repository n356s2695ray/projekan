// # Kartu saldo glossy dengan tampilan besar
import React, { useState } from "react";
import { TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const CardBalance = () => {
  const { walletTotals, totalIncome, totalExpense, darkMode } = useFinance();
  const [showBalance, setShowBalance] = useState(true);

const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br from-purple-600 to-pink-500 shadow-xl"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-white" />
              <span className="text-white/90 font-medium">Total Balance</span>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showBalance ? (
                <EyeOff className="w-5 h-5 text-white" />
              ) : (
                <Eye className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {showBalance
              ? formatCurrency(walletTotals?.totalBalance ?? 0)
              : "••••••••"}
          </h2>

          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300 font-medium">
              +12.5% from last month
            </span>
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div
        className={`rounded-2xl p-6 border shadow-lg transition-all
        ${
          darkMode
            ? "bg-gray-800 border-gray-700" // PERBAIKAN: hapus /50 dan backdrop-blur-sm
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <span
              className={`font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Total Income
            </span>
          </div>

          <span className="text-green-500 font-bold">+25%</span>
        </div>

        <h3 className="text-2xl font-bold text-green-500 mb-2">
          {formatCurrency(totalIncome)}
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          15 transactions this month
        </p>
      </div>

      {/* Expense Card */}
      <div
        className={`rounded-2xl p-6 border shadow-lg transition-all
        ${
          darkMode
            ? "bg-gray-800 border-gray-700" // PERBAIKAN: hapus /50 dan backdrop-blur-sm
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <span
              className={`font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Total Expense
            </span>
          </div>

          <span className="text-red-500 font-bold">-8%</span>
        </div>

        <h3 className="text-2xl font-bold text-red-500 mb-2">
          {formatCurrency(totalExpense)}
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          22 transactions this month
        </p>
      </div>
    </div>
  );
};

export default CardBalance;

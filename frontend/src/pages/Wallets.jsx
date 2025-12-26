import React, { useState, useEffect } from "react";
import { transferWallet } from "../services/walletsApi";
import {
  Wallet,
  CreditCard,
  Banknote,
  Plus,
  TrendingUp,
  MoreVertical,
  Smartphone,
  Building,
  ArrowUpRight,
  Shield,
  PieChart,
  ChevronDown,
  Check,
  AlertCircle,
  X,
  Loader2,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

const Wallets = () => {
  const {
    wallets,
    walletTotals,
    loading: contextLoading,
    refreshing,
    afterMutation,
  } = useFinance();

  const [isDarkMode, setIsDarkMode] = useState(darkModeManager.getDarkMode());
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transferData, setTransferData] = useState({
    from_wallet_id: "",
    to_wallet_id: "",
    amount: "",
    description: "",
  });
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  const [showTransferError, setShowTransferError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("balance_desc");

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount, currency = "IDR") => {
    const num = Number(amount);
    if (!isFinite(num)) return currency === "IDR" ? "Rp 0" : "$0.00";

    if (currency === "IDR") {
      // Format untuk IDR tanpa desimal
      if (Math.abs(num) >= 1000000000) {
        return `Rp ${(num / 1000000000).toFixed(2)}B`;
      }
      if (Math.abs(num) >= 1000000) {
        return `Rp ${(num / 1000000).toFixed(2)}M`;
      }
      if (Math.abs(num) >= 1000) {
        return `Rp ${(num / 1000).toFixed(1)}K`;
      }
      return `Rp ${Math.round(num).toLocaleString("id-ID")}`;
    }

    // Format untuk mata uang lain
    if (Math.abs(num) >= 1000000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(num / 1000000) + "M"
      );
    }

    if (Math.abs(num) >= 1000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(num / 1000) + "K"
      );
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatFullCurrency = (amount, currency = "IDR") => {
    const num = Number(amount);
    if (!isFinite(num)) return currency === "IDR" ? "Rp 0" : "$0.00";

    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const filteredWallets = wallets.filter((wallet) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return wallet.status === "active";
    if (activeFilter === "inactive") return wallet.status === "inactive";
    return wallet.type === activeFilter;
  });

  const sortedWallets = [...filteredWallets].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.type.localeCompare(b.type);
      case "balance_asc":
        return Number(a.balance || 0) - Number(b.balance || 0);
      case "balance_desc":
      default:
        return Number(b.balance || 0) - Number(a.balance || 0);
    }
  });

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
  };

  const validateTransfer = () => {
    if (!transferData.from_wallet_id) return "Please select source wallet";
    if (!transferData.to_wallet_id) return "Please select destination wallet";
    if (transferData.from_wallet_id === transferData.to_wallet_id)
      return "Cannot transfer to same wallet";

    const amount = Number(transferData.amount);
    if (!amount || amount <= 0) return "Please enter a valid amount";

    const fromWallet = wallets.find(
      (w) => w.id === Number(transferData.from_wallet_id)
    );
    if (!fromWallet) return "Source wallet not found";

    if (fromWallet.type === "credit") {
      const usedCredit = Math.abs(Number(fromWallet.balance || 0));
      const available = Number(fromWallet.credit_limit || 0) - usedCredit;
      if (amount > available) return "Exceeds available credit limit";
    } else if (amount > Number(fromWallet.balance || 0)) {
      return "Insufficient balance";
    }

    return null;
  };

  const handleTransfer = async () => {
    const error = validateTransfer();
    if (error) {
      setErrorMessage(error);
      setShowTransferError(true);
      setTimeout(() => setShowTransferError(false), 3000);
      return;
    }

    setIsTransferring(true);
    try {
      await transferWallet({
        from_wallet_id: Number(transferData.from_wallet_id),
        to_wallet_id: Number(transferData.to_wallet_id),
        amount: Number(transferData.amount),
        description: transferData.description || null,
      });

      setShowTransferSuccess(true);
      setTimeout(() => setShowTransferSuccess(false), 3000);

      await afterMutation();

      setTransferData({
        from_wallet_id: "",
        to_wallet_id: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Transfer failed"
      );
      setShowTransferError(true);
      setTimeout(() => setShowTransferError(false), 3000);
    } finally {
      setIsTransferring(false);
    }
  };

  if (contextLoading && wallets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p
            className={`transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading your wallets...
          </p>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { value: "all", label: "All Wallets" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "bank", label: "Bank" },
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "digital", label: "Digital" },
  ];

  const sortOptions = [
    { value: "balance_desc", label: "Highest Balance" },
    { value: "balance_asc", label: "Lowest Balance" },
    { value: "name", label: "Name" },
    { value: "type", label: "Type" },
  ];

  const transferableWallets = wallets.filter(
    (w) => w.status === "active" && w.type !== "credit"
  );

  const getWalletIcon = (type) => {
    switch (type) {
      case "bank":
        return Building;
      case "credit":
        return CreditCard;
      case "digital":
        return Smartphone;
      case "cash":
        return Banknote;
      default:
        return Wallet;
    }
  };

  const getWalletColor = (type) => {
    switch (type) {
      case "bank":
        return "text-blue-500 bg-blue-500/20";
      case "credit":
        return "text-purple-500 bg-purple-500/20";
      case "digital":
        return "text-green-500 bg-green-500/20";
      case "cash":
        return "text-yellow-500 bg-yellow-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Notification Toasts */}
      {showTransferSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <Check className="w-6 h-6" />
            <div>
              <div className="font-medium">Transfer Successful!</div>
              <div className="text-sm opacity-90">
                Funds have been transferred successfully.
              </div>
            </div>
          </div>
        </div>
      )}

      {showTransferError && (
        <div className="fixed top-6 right-6 z-50 animate-slideInRight">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <div className="font-medium">Transfer Failed</div>
              <div className="text-sm opacity-90">{errorMessage}</div>
            </div>
            <button
              onClick={() => setShowTransferError(false)}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-colors duration-500 ${
            isDarkMode
              ? "from-purple-900/20 via-gray-900 to-gray-900"
              : "from-purple-500/10 via-white to-pink-500/10"
          }`}
        ></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div
                  className={`p-3 rounded-2xl backdrop-blur-sm border transition-colors shrink-0 ${
                    isDarkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-white/80 border-white/20 shadow-lg"
                  }`}
                >
                  <Wallet
                    className={`w-8 h-8 transition-colors ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <h1
                    className={`text-2xl sm:text-3xl font-bold transition-colors truncate ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Wallet Management
                  </h1>
                  <p
                    className={`mt-1 sm:mt-2 text-base sm:text-lg transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Manage all your financial accounts
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddWallet(true)}
              className="group relative w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                text-white rounded-2xl hover:shadow-2xl transition-all duration-300 
                hover:scale-105 flex items-center justify-center sm:justify-start space-x-3 font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10 truncate">Add New Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Total Balance Overview */}
      <div className="relative overflow-hidden rounded-3xl group">
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
            isDarkMode
              ? "from-gray-900 via-purple-900/30 to-gray-900"
              : "from-purple-600 via-pink-500 to-purple-700"
          }`}
        ></div>
        <div className="relative p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-white/90 font-medium text-base sm:text-lg">
                  Total Balance
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight break-all">
                  {formatCurrency(walletTotals?.totalBalance || 0)}
                </h2>
                <p className="text-white/70 text-sm sm:text-base break-words">
                  Full amount:{" "}
                  {formatFullCurrency(walletTotals?.totalBalance || 0)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-300 font-medium text-sm sm:text-base">
                  Total across {wallets.length} wallets
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  label: "Total Assets",
                  value: walletTotals?.totalAssets || 0,
                  color: "bg-emerald-400",
                  width: "85%",
                },
                {
                  label: "Credit Used",
                  value: walletTotals?.creditUsed || 0,
                  color: "bg-red-400",
                  width: "24%",
                },
                {
                  label: "Total Wallets",
                  value: wallets.length,
                  color: "bg-blue-400",
                  width: "100%",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="text-xl sm:text-2xl font-bold text-white truncate">
                    {typeof item.value === "number" &&
                    item.label !== "Total Wallets"
                      ? formatCurrency(item.value)
                      : item.value}
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm mt-1 truncate">
                    {item.label}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: item.width }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Grid */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h2
              className={`text-xl sm:text-2xl font-bold transition-colors truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your Wallets
            </h2>
            <p
              className={`mt-1 transition-colors text-sm sm:text-base ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {sortedWallets.length} accounts •{" "}
              {sortedWallets.filter((w) => w.status === "active").length} active
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none min-w-0">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className={`w-full px-9 sm:px-10 pr-3 sm:pr-4 py-2 rounded-xl transition-all duration-300 appearance-none truncate ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>

            <div className="relative flex-1 sm:flex-none min-w-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-9 sm:px-10 pr-3 sm:pr-4 py-2 rounded-xl transition-all duration-300 appearance-none truncate ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
          </div>
        </div>

        {sortedWallets.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3
              className={`text-xl font-bold transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              No wallets found
            </h3>
            <p
              className={`transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } mb-6`}
            >
              Add your first wallet to get started
            </p>
            <button
              onClick={() => setShowAddWallet(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Add First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {sortedWallets.map((wallet) => {
              const Icon = getWalletIcon(wallet.type);
              const colorClasses = getWalletColor(wallet.type);
              const [textColor, bgColor] = colorClasses.split(" ");

              return (
                <div
                  key={wallet.id}
                  className={`rounded-2xl border p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] min-w-0 ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`p-2 sm:p-3 rounded-xl ${bgColor} shrink-0`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${textColor}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`font-bold text-sm sm:text-base transition-colors truncate ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {wallet.name}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm transition-colors truncate ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {wallet.type?.charAt(0).toUpperCase() +
                            wallet.type?.slice(1)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-1.5 sm:p-2 rounded-lg hover:opacity-80 transition-colors shrink-0 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <div className="mb-1">
                      <span
                        className={`text-2xl sm:text-3xl font-bold transition-colors break-all ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(wallet.balance || 0, wallet.currency)}
                      </span>
                    </div>
                    <div
                      className={`text-xs sm:text-sm transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <div className="truncate">Current Balance</div>
                      <div className="text-xs opacity-75 mt-0.5">
                        Full:{" "}
                        {formatFullCurrency(
                          wallet.balance || 0,
                          wallet.currency
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm transition-colors truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Account Number
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-medium transition-colors truncate ml-2 text-right max-w-[50%] ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {wallet.account_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                          wallet.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {wallet.status}
                      </span>
                    </div>
                    {wallet.type === "credit" && wallet.credit_limit && (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm transition-colors truncate ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Credit Limit
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-medium transition-colors truncate ml-2 text-right ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatCurrency(wallet.credit_limit, wallet.currency)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Wallet Card */}
            <div
              className={`relative rounded-2xl sm:rounded-3xl border-2 border-dashed overflow-hidden group transition-all duration-500 hover:scale-[1.02] min-h-[280px] sm:min-h-[300px] ${
                isDarkMode
                  ? "border-gray-700 hover:border-purple-500/50"
                  : "border-gray-300 hover:border-purple-400"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                    : "bg-gradient-to-br from-purple-50 to-pink-50"
                }`}
              ></div>
              <button
                onClick={() => setShowAddWallet(true)}
                className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-8"
              >
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mb-4 sm:mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl ${
                    isDarkMode
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                      : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                  }`}
                >
                  <Plus
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 ${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-purple-400"
                        : "text-gray-400 group-hover:text-purple-600"
                    }`}
                  />
                  <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-gray-400/0 group-hover:border-purple-500/50 transition-all duration-500"></div>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300 text-center ${
                    isDarkMode
                      ? "text-gray-300 group-hover:text-white"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  Add New Wallet
                </h3>
                <p
                  className={`text-xs sm:text-sm text-center max-w-xs transition-colors duration-300 px-2 ${
                    isDarkMode
                      ? "text-gray-500 group-hover:text-gray-400"
                      : "text-gray-600 group-hover:text-gray-700"
                  }`}
                >
                  Connect bank account, digital wallet, or credit card
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Transfer */}
      <div
        className={`rounded-3xl overflow-hidden transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900/80 to-gray-800/80"
            : "bg-gradient-to-br from-white to-gray-50/80"
        } shadow-xl`}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <div
              className={`p-3 rounded-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                  : "bg-gradient-to-br from-purple-100 to-pink-100"
              }`}
            >
              <PieChart
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <div className="min-w-0">
              <h3
                className={`text-xl sm:text-2xl font-bold transition-colors truncate ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Quick Transfer
              </h3>
              <p
                className={`mt-1 text-sm sm:text-base transition-colors truncate ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Transfer funds between your wallets instantly
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label
                className={`block text-sm font-medium mb-2 sm:mb-3 transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                From Wallet
              </label>
              <div className="relative">
                <select
                  name="from_wallet_id"
                  value={transferData.from_wallet_id}
                  onChange={handleTransferChange}
                  className={`w-full px-4 py-3 sm:py-4 rounded-xl appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600 focus:border-purple-500"
                      : "bg-white/50 border border-gray-300 text-gray-700 hover:border-gray-400 focus:border-purple-400"
                  }`}
                >
                  <option value="">Select source wallet</option>
                  {transferableWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} (
                      {formatCurrency(wallet.balance, wallet.currency)})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 sm:mb-3 transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                To Wallet
              </label>
              <div className="relative">
                <select
                  name="to_wallet_id"
                  value={transferData.to_wallet_id}
                  onChange={handleTransferChange}
                  className={`w-full px-4 py-3 sm:py-4 rounded-xl appearance-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600 focus:border-purple-500"
                      : "bg-white/50 border border-gray-300 text-gray-700 hover:border-gray-400 focus:border-purple-400"
                  }`}
                >
                  <option value="">Select destination wallet</option>
                  {transferableWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 sm:mb-3 transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={transferData.amount || ""}
                  onChange={handleTransferChange}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 hover:border-gray-600 focus:border-purple-500"
                      : "bg-white/50 border border-gray-300 text-gray-700 placeholder-gray-400 hover:border-gray-400 focus:border-purple-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 sm:mb-3 transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description (Optional)
              </label>
              <input
                type="text"
                name="description"
                value={transferData.description || ""}
                onChange={handleTransferChange}
                placeholder="e.g., Transfer for groceries"
                className={`w-full px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-gray-800/50 border border-gray-700 text-gray-300 placeholder-gray-500 hover:border-gray-600 focus:border-purple-500"
                    : "bg-white/50 border border-gray-300 text-gray-700 placeholder-gray-400 hover:border-gray-400 focus:border-purple-400"
                }`}
              />
            </div>

            <button
              onClick={handleTransfer}
              disabled={isTransferring || refreshing}
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base ${
                isTransferring || refreshing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              } text-white`}
            >
              {isTransferring || refreshing ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Transfer Now</span>
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

            <div
              className={`text-xs text-center pt-4 border-t transition-colors ${
                isDarkMode
                  ? "text-gray-500 border-gray-700"
                  : "text-gray-600 border-gray-200"
              }`}
            >
              Transfers are processed instantly • Credit cards excluded
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallets;

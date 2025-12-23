import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Filter,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Building,
  Smartphone,
  Globe,
  Bitcoin,
  Wallet,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { darkModeManager } from "../utils/darkModeManager";

const Investments = () => {
  const [isDarkMode, setIsDarkMode] = useState(darkModeManager.getDarkMode());
  const [timeRange, setTimeRange] = useState("1y");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  // Mock investment data
  const [investments, setInvestments] = useState([
    {
      id: 1,
      name: "Apple Inc.",
      symbol: "AAPL",
      type: "stock",
      category: "tech",
      quantity: 10,
      avgPrice: 150,
      currentPrice: 175,
      value: 1750,
      currency: "USD",
      allocation: 25,
      dailyChange: 2.5,
      totalReturn: 16.7,
      notes: "Long-term growth stock",
    },
    {
      id: 2,
      name: "S&P 500 ETF",
      symbol: "VOO",
      type: "etf",
      category: "index",
      quantity: 5,
      avgPrice: 400,
      currentPrice: 420,
      value: 2100,
      currency: "USD",
      allocation: 30,
      dailyChange: 0.8,
      totalReturn: 5.0,
      notes: "Core portfolio holding",
    },
    {
      id: 3,
      name: "Government Bonds",
      symbol: "GBOND",
      type: "bond",
      category: "fixed",
      quantity: 100,
      avgPrice: 100,
      currentPrice: 102,
      value: 10200,
      currency: "IDR",
      allocation: 20,
      dailyChange: 0.1,
      totalReturn: 2.0,
      notes: "Low-risk fixed income",
    },
  ]);

  // Performance data
  const performanceData = [
    { date: "Jan", portfolio: 5000, benchmark: 4800 },
    { date: "Feb", portfolio: 5200, benchmark: 4900 },
    { date: "Mar", portfolio: 5100, benchmark: 5000 },
    { date: "Apr", portfolio: 5500, benchmark: 5100 },
    { date: "May", portfolio: 5800, benchmark: 5200 },
    { date: "Jun", portfolio: 6000, benchmark: 5300 },
    { date: "Jul", portfolio: 6200, benchmark: 5400 },
    { date: "Aug", portfolio: 6500, benchmark: 5600 },
    { date: "Sep", portfolio: 6800, benchmark: 5800 },
    { date: "Oct", portfolio: 7000, benchmark: 5900 },
    { date: "Nov", portfolio: 7200, benchmark: 6000 },
    { date: "Dec", portfolio: 7500, benchmark: 6200 },
  ];

  // Asset allocation data
  const allocationData = [
    { name: "Stocks", value: 25, color: "#3B82F6" },
    { name: "ETFs", value: 30, color: "#10B981" },
    { name: "Bonds", value: 20, color: "#8B5CF6" },
    { name: "Crypto", value: 15, color: "#F59E0B" },
    { name: "REITs", value: 10, color: "#EC4899" },
  ];

  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    const totalValue = investments.reduce(
      (sum, inv) => sum + (inv.value || 0),
      0
    );
    const totalInvested = investments.reduce(
      (sum, inv) => sum + (inv.avgPrice || 0) * (inv.quantity || 0),
      0
    );

    const totalReturn =
      investments.length > 0
        ? investments.reduce((sum, inv) => {
            const invested = (inv.avgPrice || 0) * (inv.quantity || 0);
            const current = (inv.currentPrice || 0) * (inv.quantity || 0);
            return (
              sum + (invested > 0 ? ((current - invested) / invested) * 100 : 0)
            );
          }, 0) / investments.length
        : 0;

    const dailyChange =
      investments.length > 0
        ? investments.reduce((sum, inv) => sum + (inv.dailyChange || 0), 0) /
          investments.length
        : 0;

    const bestPerformer =
      investments.length > 0
        ? investments.reduce(
            (best, inv) => (inv.totalReturn > best.totalReturn ? inv : best),
            investments[0]
          )
        : { name: "N/A", symbol: "N/A", totalReturn: 0 };

    const worstPerformer =
      investments.length > 0
        ? investments.reduce(
            (worst, inv) => (inv.totalReturn < worst.totalReturn ? inv : worst),
            investments[0]
          )
        : { name: "N/A", symbol: "N/A", totalReturn: 0 };

    return {
      totalValue,
      totalInvested,
      totalReturn,
      dailyChange,
      bestPerformer,
      worstPerformer,
    };
  }, [investments]);

  const formatCurrency = (amount, currency = "USD") => {
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case "stock":
        return TrendingUp;
      case "etf":
        return BarChart3;
      case "bond":
        return Building;
      case "crypto":
        return Bitcoin;
      case "reit":
        return Building;
      default:
        return TrendingUp;
    }
  };

  const getAssetColor = (type) => {
    switch (type) {
      case "stock":
        return "blue";
      case "etf":
        return "green";
      case "bond":
        return "purple";
      case "crypto":
        return "yellow";
      case "reit":
        return "pink";
      default:
        return "gray";
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { text: "text-blue-500", bg: "bg-blue-500/20" },
      green: { text: "text-green-500", bg: "bg-green-500/20" },
      purple: { text: "text-purple-500", bg: "bg-purple-500/20" },
      yellow: { text: "text-yellow-500", bg: "bg-yellow-500/20" },
      pink: { text: "text-pink-500", bg: "bg-pink-500/20" },
      gray: { text: "text-gray-500", bg: "bg-gray-500/20" },
    };

    return colorMap[color] || colorMap.gray;
  };

  const deleteInvestment = (id) => {
    setInvestments(investments.filter((inv) => inv.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4">
            <RefreshCw className="w-12 h-12" />
          </div>
          <p
            className={`transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading investments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div
        className={`rounded-2xl p-6 transition-colors ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-900"
            : "bg-gradient-to-r from-purple-50 to-pink-50"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1
              className={`text-2xl font-bold transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Investment Portfolio
            </h1>
            <p
              className={`mt-2 transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Track and manage your investments in one place
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                text-white rounded-xl hover:opacity-90 transition-opacity 
                flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Investment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Wallet className="w-6 h-6 text-blue-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Value
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {formatCurrency(portfolioStats.totalValue, "USD")}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Current portfolio value
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Return
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              portfolioStats.totalReturn >= 0
                ? "text-green-500"
                : "text-red-500"
            } mb-1`}
          >
            {formatPercentage(portfolioStats.totalReturn)}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Since inception
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <RefreshCw className="w-6 h-6 text-yellow-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Daily Change
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${
              portfolioStats.dailyChange >= 0
                ? "text-green-500"
                : "text-red-500"
            } mb-1`}
          >
            {formatPercentage(portfolioStats.dailyChange)}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            24h performance
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Diversification
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-500 mb-1">
            {investments.length} Assets
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Across categories
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div
          className={`rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          } p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-xl font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Portfolio Performance
              </h3>
              <p
                className={`mt-1 transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                vs S&P 500 Benchmark
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`flex rounded-xl p-1 transition-colors ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                {["1m", "3m", "6m", "1y", "all"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      timeRange === range
                        ? "bg-purple-500 text-white"
                        : isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                />
                <YAxis
                  stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }).format(value),
                    "Value",
                  ]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                    color: isDarkMode ? "#ffffff" : "#111827",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  name="Your Portfolio"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="S&P 500"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Allocation */}
        <div
          className={`rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          } p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-xl font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Asset Allocation
              </h3>
              <p
                className={`mt-1 transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Portfolio diversification
              </p>
            </div>
            <PieChart
              className={`w-5 h-5 transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Allocation"]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                    color: isDarkMode ? "#ffffff" : "#111827",
                  }}
                />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation Breakdown */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {allocationData.map((asset, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span
                    className={`text-sm transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {asset.name}
                  </span>
                </div>
                <span
                  className={`font-medium transition-colors ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {asset.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div
        className={`rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        } p-6`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3
              className={`text-xl font-bold transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Investment Holdings
            </h3>
            <p
              className={`mt-1 transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {investments.length} assets in portfolio
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-500 text-white"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <button
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Investments Table/Grid */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b transition-colors ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Asset
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Quantity
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Avg Price
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Current Price
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Value
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Return
                  </th>
                  <th
                    className={`py-3 px-4 text-left font-semibold transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => {
                  const Icon = getAssetIcon(investment.type);
                  const color = getAssetColor(investment.type);
                  const colorClass = getColorClasses(color);

                  return (
                    <tr
                      key={investment.id}
                      className={`border-b transition-colors ${
                        isDarkMode
                          ? "border-gray-800 hover:bg-gray-800/50"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${colorClass.bg}`}>
                            <Icon className={`w-5 h-5 ${colorClass.text}`} />
                          </div>
                          <div>
                            <div
                              className={`font-medium transition-colors ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {investment.name}
                            </div>
                            <div
                              className={`text-sm transition-colors ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {investment.symbol} •{" "}
                              {investment.type.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`transition-colors ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {investment.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`transition-colors ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {formatCurrency(
                            investment.avgPrice,
                            investment.currency
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`transition-colors ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(
                            investment.currentPrice,
                            investment.currency
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`font-semibold transition-colors ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(
                            investment.value,
                            investment.currency
                          )}
                        </div>
                        <div
                          className={`text-xs transition-colors ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {investment.allocation}% of portfolio
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {investment.totalReturn >= 0 ? (
                            <ChevronUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`font-semibold ${
                              investment.totalReturn >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatPercentage(investment.totalReturn)}
                          </span>
                        </div>
                        <div
                          className={`text-xs transition-colors ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Daily: {formatPercentage(investment.dailyChange)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedAsset(investment)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? "hover:bg-gray-700 text-gray-400"
                                : "hover:bg-gray-200 text-gray-600"
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteInvestment(investment.id)}
                            className={`p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => {
              const Icon = getAssetIcon(investment.type);
              const color = getAssetColor(investment.type);
              const colorClass = getColorClasses(color);

              return (
                <div
                  key={investment.id}
                  className={`rounded-2xl border transition-colors ${
                    isDarkMode
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-white border-gray-200"
                  } p-6`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${colorClass.bg}`}>
                        <Icon className={`w-6 h-6 ${colorClass.text}`} />
                      </div>
                      <div>
                        <h4
                          className={`font-bold transition-colors ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {investment.symbol}
                        </h4>
                        <p
                          className={`text-sm transition-colors ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {investment.name}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        className={`p-2 rounded-lg hover:opacity-80 transition-colors
                        ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Current Value
                      </span>
                      <div
                        className={`text-lg font-bold transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(investment.value, investment.currency)}
                      </div>
                    </div>

                    <div
                      className={`h-2 rounded-full overflow-hidden transition-colors ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${investment.allocation}%`,
                          backgroundColor: colorClass.text
                            .replace("text-", "")
                            .replace("-500", "-500"),
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs transition-colors ${
                          isDarkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {investment.allocation}% of portfolio
                      </span>
                      <span
                        className={`text-xs transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {investment.quantity} shares
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Avg Buy Price
                      </span>
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(
                          investment.avgPrice,
                          investment.currency
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Current Price
                      </span>
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(
                          investment.currentPrice,
                          investment.currency
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Total Return
                      </span>
                      <div className="flex items-center space-x-2">
                        {investment.totalReturn >= 0 ? (
                          <ChevronUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`font-semibold ${
                            investment.totalReturn >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatPercentage(investment.totalReturn)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <button
                      className={`flex-1 px-4 py-2 rounded-xl transition-colors ${
                        isDarkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Buy More
                    </button>

                    <button
                      className={`flex-1 px-4 py-2 rounded-xl transition-colors ${
                        isDarkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {investments.length === 0 && (
          <div className="text-center py-12">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
              }`}
            >
              <TrendingUp className="w-8 h-8 text-gray-500" />
            </div>
            <h4
              className={`text-lg font-medium mb-2 transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No investments yet
            </h4>
            <p
              className={`transition-colors ${
                isDarkMode ? "text-gray-500" : "text-gray-600"
              } mb-6`}
            >
              Start building your investment portfolio
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Add First Investment
            </button>
          </div>
        )}
      </div>

      {/* Market Insights */}
      <div
        className={`rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        } p-6`}
      >
        <h3
          className={`text-xl font-bold mb-6 transition-colors ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Market Insights & Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Performers */}
          <div
            className={`p-6 rounded-xl transition-colors ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h4
                className={`font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Top Performer
              </h4>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div>
                <div
                  className={`font-semibold transition-colors ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {portfolioStats.bestPerformer.name}
                </div>
                <div
                  className={`text-sm transition-colors ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {portfolioStats.bestPerformer.symbol}
                </div>
              </div>
              <div className={`text-2xl font-bold text-green-500`}>
                {formatPercentage(portfolioStats.bestPerformer.totalReturn)}
              </div>
            </div>

            <div
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Consider increasing allocation
            </div>
          </div>

          {/* Rebalancing Alert */}
          <div
            className={`p-6 rounded-xl transition-colors ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h4
                className={`font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Rebalancing Needed
              </h4>
            </div>

            <div className="mb-2">
              <div
                className={`font-semibold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Portfolio is 65% stocks
              </div>
              <div
                className={`text-sm transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Consider adding bonds for balance
              </div>
            </div>

            <div
              className={`text-xs px-3 py-1 rounded-full inline-block transition-colors ${
                isDarkMode
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Medium Risk
            </div>
          </div>

          {/* AI Recommendation */}
          <div
            className={`p-6 rounded-xl transition-colors ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-blue-500" />
              <h4
                className={`font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Smart Recommendation
              </h4>
            </div>

            <div className="mb-2">
              <div
                className={`font-semibold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add International Exposure
              </div>
              <div
                className={`text-sm transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Consider adding emerging markets ETF
              </div>
            </div>

            <button
              className={`w-full mt-4 px-4 py-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              View Suggestions
            </button>
          </div>
        </div>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl w-full max-w-md p-6 transition-colors ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add New Investment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Investment Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="e.g., Apple Inc."
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Symbol/Ticker
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="e.g., AAPL"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Type
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="stock">Stock</option>
                  <option value="etf">ETF</option>
                  <option value="bond">Bond</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="reit">REIT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="e.g., 150"
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Currency
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity">
                Add Investment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;

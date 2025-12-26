import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  TrendingUp,
  Target,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  Coffee,
  Book,
  Heart,
} from "lucide-react";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

const Analytics = () => {
  // Subscribe to dark mode from manager
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const {
    getCategoryData,
    getMonthlyData,
    totalIncome = 0,
    totalExpense = 0,
  } = useFinance();
  
  const [timeRange, setTimeRange] = useState("month");
  const [activeChart, setActiveChart] = useState("spending");

  const categoryData = getCategoryData("expense") || [];
  const monthlyComparison = getMonthlyData(timeRange) || [];

  const topCategories = [...categoryData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Calculate insights
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.total, 0);
const averageSpending =
  monthlyComparison.length > 0
    ? monthlyComparison.reduce((sum, m) => sum + m.expense, 0) /
      monthlyComparison.length
    : 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const insights = [
    {
      title: "Total Spent",
      value: `Rp ${totalSpent.toLocaleString("id-ID")}`,
      change: "+15%",
      isPositive: false,
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      change: "+5.2%",
      isPositive: true,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Average Monthly",
      value: `Rp ${averageSpending.toLocaleString("id-ID")}`,
      change: "-3.1%",
      isPositive: true,
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Top Category",
      value: categoryData[0]?.name || "N/A",
      change: categoryData[0]
        ? `${((categoryData[0].total / (totalSpent || 1)) * 100).toFixed(1)}%`
        : "0%",
      isPositive: null,
      icon: AlertCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
  ];

  const spendingHabits = topCategories.map((c, i) => ({
    category: c.name,
    current: totalSpent
      ? Math.min(100, Math.round((c.total / totalSpent) * 100))
      : 0,
    fullMark: 100,
  }));

  const getCategoryIcon = (category) => {
    const icons = {
      Food: Utensils,
      Transport: Car,
      Shopping: ShoppingBag,
      Bills: CreditCard,
      Entertainment: Coffee,
      Health: Heart,
      Education: Book,
      Housing: Home,
      Other: DollarSign,
    };
    return icons[category] || DollarSign;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  console.log("categoryData", categoryData);
  console.log("monthlyComparison", monthlyComparison);


  return (
    <div className="min-h-screen pb-6">
      {/* Header dengan dark mode */}
      <div className="sticky top-0 z-20 backdrop-blur-sm">
        <div className={`px-4 sm:px-6 py-4 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Financial Analytics
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Deep insights into your spending patterns and trends
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}>
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}>
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${insight.bgColor}`}>
                    <Icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      insight.isPositive === true
                        ? darkMode
                          ? "bg-green-900/30 text-green-400"
                          : "bg-green-100 text-green-700"
                        : insight.isPositive === false
                        ? darkMode
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-700"
                        : darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {insight.change}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {insight.value}
                </div>
                <div
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {insight.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Distribution */}
          <div className={`rounded-2xl border p-6 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Spending Distribution
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Where your money goes
                </p>
              </div>
              <PieChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>

            <div className="h-80">
              {topCategories.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={topCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {topCategories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#d1d5db',
                        color: darkMode ? '#e5e7eb' : '#374151',
                      }}
                      formatter={(value) => [formatCurrency(value), "Amount"]}
                    />
                    <Legend
                      wrapperStyle={{
                        color: darkMode ? '#e5e7eb' : '#374151',
                      }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {topCategories.map((category, index) => {
                const Icon = getCategoryIcon(category.name);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <Icon
                        className={`w-4 h-4 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {category.name}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {formatCurrency(category.total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className={`rounded-2xl border p-6 ${
            darkMode
              ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Trend
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Income vs Expenses
                </p>
              </div>

              <div className={`flex rounded-xl p-1 ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200"
              }`}>
                {["month", "quarter", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      timeRange === range
                        ? darkMode
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyComparison}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  />
                  <YAxis
                    stroke={darkMode ? "#9ca3af" : "#6b7280"}
                    tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                        .format(value)
                        .replace("Rp", "Rp ")
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#d1d5db',
                      color: darkMode ? '#e5e7eb' : '#374151',
                    }}
                    formatter={(value) => [
                      new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(value),
                      "Amount",
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: darkMode ? '#e5e7eb' : '#374151',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"
              }`}>
                <div className={`text-lg font-bold mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(totalIncome)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Income
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${
                darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"
              }`}>
                <div className={`text-lg font-bold mb-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {formatCurrency(totalExpense)}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Expense
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart - Spending Habits */}
        <div className={`rounded-2xl border p-6 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Spending Habits Analysis
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comparison across categories
              </p>
            </div>
            <div className={`flex rounded-xl p-1 ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200"
            }`}>
              <button
                onClick={() => setActiveChart("spending")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeChart === "spending"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Spending
              </button>
              <button
                onClick={() => setActiveChart("budget")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeChart === "budget"
                    ? darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Budget
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={spendingHabits}>
                <PolarGrid stroke={darkMode ? "#4b5563" : "#d1d5db"} />
                <PolarAngleAxis
                  dataKey="category"
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke={darkMode ? "#9ca3af" : "#6b7280"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
                />
                <Radar
                  name="Current Month"
                  dataKey="current"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#d1d5db',
                    color: darkMode ? '#e5e7eb' : '#374151',
                  }}
                  formatter={(value) => [`${value}%`, "Usage"]}
                />
                <Legend 
                  wrapperStyle={{
                    color: darkMode ? '#e5e7eb' : '#374151',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`rounded-2xl border p-6 ${
          darkMode
            ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-blue-500" />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Budget Optimization
                </h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your food spending is 35% above average. Consider meal planning to reduce costs.
              </p>
            </div>

            <div className={`p-6 rounded-xl border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Savings Opportunity
                </h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You could save Rp 500,000 monthly by reducing entertainment expenses by 20%.
              </p>
            </div>

            <div className={`p-6 rounded-xl border ${
              darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Alert: High Spending
                </h4>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Shopping category exceeded budget by 45%. Review recent purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
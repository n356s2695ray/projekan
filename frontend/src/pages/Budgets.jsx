import React, { useState, useEffect } from "react";
import {
  Plus,
  Target,
  CheckCircle,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";

const Budgets = () => {
  const {
    budgets,
    categories,
    getBudgetUsage,
    addBudget,
    removeBudget,
  } = useFinance();

  const [isDarkMode, setIsDarkMode] = useState(darkModeManager.getDarkMode());
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category_id: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  const expenseCategories = Array.isArray(categories)
    ? categories.filter((c) => c.type === "expense")
    : [];

  const totalBudget = Object.values(budgets || {}).reduce(
    (sum, budget) => sum + Number(budget || 0),
    0
  );

  const totalSpent = expenseCategories.reduce((sum, cat) => {
    const usage = getBudgetUsage(cat.id);
    return sum + usage.spent;
  }, 0);

  const remainingBudget = Math.max(totalBudget - totalSpent, 0);
  const averageUsage =
    expenseCategories.length > 0
      ? expenseCategories.reduce((sum, cat) => {
          const usage = getBudgetUsage(cat.id);
          return sum + usage.percentage;
        }, 0) / expenseCategories.length
      : 0;

  const handleAddBudget = async () => {
    if (!newBudget.amount || !newBudget.category_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addBudget({
        category_id: Number(newBudget.category_id),
        amount: Number(newBudget.amount),
        month: newBudget.month,
        year: newBudget.year,
      });

      setShowAddBudget(false);
      setNewBudget({
        category_id: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Failed to add budget");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (iconName) => {
    const iconMap = {
      food: "🍔",
      transport: "🚗",
      shopping: "🛍️",
      entertainment: "🎬",
      bills: "🧾",
      health: "🏥",
      education: "📚",
      housing: "🏠",
      other: "💸",
    };
    return iconMap[iconName?.toLowerCase()] || "💰";
  };


  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 transition-colors ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-gray-900"
          : "bg-gradient-to-r from-purple-50 to-pink-50"
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Budget Management
            </h1>
            <p className={`mt-2 transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Set and track your spending limits
            </p>
          </div>

          <button
            onClick={() => setShowAddBudget(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
              text-white rounded-xl hover:opacity-90 transition-opacity 
              flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Budget</span>
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <span className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total Budget
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {formatCurrency(totalBudget)}
          </div>
          <div className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Across all categories
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <span className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Remaining
            </span>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">
            {formatCurrency(remainingBudget)}
          </div>
          <div className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {((remainingBudget / totalBudget) * 100 || 0).toFixed(1)}% of total
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-colors ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <span className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Average Usage
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            averageUsage > 90
              ? "text-red-500"
              : averageUsage > 75
              ? "text-yellow-500"
              : "text-purple-500"
          } mb-1`}>
            {averageUsage.toFixed(1)}%
          </div>
          <div className={`text-sm transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Across all budgets
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {expenseCategories.map((category) => {
          const usage = getBudgetUsage(category.id);
          const hasBudget = budgets && budgets[category.id];
          const isOverBudget = usage.percentage >= 100;
          const isNearLimit = usage.percentage >= 80 && usage.percentage < 100;

          return (
            <div
              key={category.id}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                  : "bg-white border-gray-200 hover:border-gray-300"
              } ${isOverBudget ? "ring-2 ring-red-500" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <div>
                    <h3
                      className={`font-bold transition-colors ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p
                      className={`text-sm transition-colors ${
                        isDarkMode ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {hasBudget ? "Budget set" : "No budget"}
                    </p>
                  </div>
                </div>
                <button
                  className={`p-2 rounded-lg hover:opacity-80 transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {hasBudget ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {usage.percentage.toFixed(1)}%
                      </span>
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatCurrency(usage.spent)} /{" "}
                        {formatCurrency(usage.budget)}
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverBudget
                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                            : isNearLimit
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-gradient-to-r from-green-500 to-emerald-500"
                        }`}
                        style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Spent
                      </span>
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(usage.spent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Budget
                      </span>
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(usage.budget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`transition-colors ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Remaining
                      </span>
                      <span
                        className={`font-medium ${
                          usage.remaining > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatCurrency(Math.max(usage.remaining, 0))}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewBudget({
                          category_id: category.id,
                          amount: usage.budget,
                          month: new Date().getMonth() + 1,
                          year: new Date().getFullYear(),
                        });
                        setShowAddBudget(true);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                        isDarkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => removeBudget(category.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Alert Badge */}
                  {isOverBudget && (
                    <div className="flex items-center gap-2 mt-4 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Over budget!</span>
                    </div>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <div className="flex items-center gap-2 mt-4 text-yellow-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Near limit</span>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setNewBudget({
                      category_id: category.id,
                      amount: "",
                      month: new Date().getMonth() + 1,
                      year: new Date().getFullYear(),
                    });
                    setShowAddBudget(true);
                  }}
                  className={`w-full mt-4 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Set Budget
                </button>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {expenseCategories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3
              className={`text-xl font-bold transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              No expense categories found
            </h3>
            <p
              className={`transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } mb-6`}
            >
              Add expense categories first to set budgets
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl w-full max-w-md p-6 transition-colors ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={`text-xl font-bold mb-6 transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {newBudget.category_id ? "Edit Budget" : "Add Budget"}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  value={newBudget.category_id}
                  onChange={(e) =>
                    setNewBudget((p) => ({ ...p, category_id: e.target.value }))
                  }
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount (IDR)
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Rp
                  </span>
                  <input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) =>
                      setNewBudget((p) => ({ ...p, amount: e.target.value }))
                    }
                    placeholder="Enter budget amount"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Month
                  </label>
                  <select
                    value={newBudget.month}
                    onChange={(e) =>
                      setNewBudget((p) => ({
                        ...p,
                        month: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {new Date(2000, month - 1).toLocaleString("default", {
                            month: "long",
                          })}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Year
                  </label>
                  <select
                    value={newBudget.year}
                    onChange={(e) =>
                      setNewBudget((p) => ({
                        ...p,
                        year: parseInt(e.target.value),
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - 2 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddBudget(false)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newBudget.category_id || !newBudget.amount}
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
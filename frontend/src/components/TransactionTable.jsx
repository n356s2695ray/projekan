import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Filter,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import AddTransactionForm from "./AddTransactionForm";
import Notification from "./Notification";
import { useFinance } from "../context/FinanceContext";
import { darkModeManager } from "../utils/darkModeManager";
import { motion } from "framer-motion";

const TransactionTable = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const {
    transactions,
    removeTransaction,
    addTransaction,
    fetchTransactions,
    updateTransaction,
  } = useFinance();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.amount?.toString().includes(searchTerm) ||
      t.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await removeTransaction(id);
        showNotification("Transaction deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete transaction", "error");
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0)
      return showNotification("No transactions selected", "warning");
    if (
      window.confirm(`Delete ${selectedRows.length} selected transactions?`)
    ) {
      selectedRows.forEach((id) => removeTransaction(id));
      setSelectedRows([]);
      showNotification(
        `${selectedRows.length} transactions deleted`,
        "success"
      );
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey)
      return <ChevronDown className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddForm(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-xl overflow-hidden ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50" 
          : "bg-white border border-gray-200"
      }`}
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Transactions
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage your income and expenses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDelete}
              disabled={selectedRows.length === 0}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                selectedRows.length > 0
                  ? darkMode
                    ? "bg-red-900/30 text-red-400 hover:bg-red-900/40 border border-red-800/50"
                    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : darkMode
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchTransactions}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingTransaction(null);
                setShowAddForm(true);
              }}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all duration-300 hover:shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Add Transaction
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-800/30"
                : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Income
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gradient-to-r from-red-900/20 to-pink-900/20 border-red-800/30"
                : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Expense
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <TrendingDown className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-800/30"
                : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Balance
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(totalIncome - totalExpense)}
                </p>
              </div>
              <Wallet className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search transactions..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-transparent'
              } border`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "income", "expense"].map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2.5 rounded-lg capitalize transition-all ${
                  filterType === type
                    ? darkMode
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-purple-500 text-white shadow-lg"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Date Range
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50'}`}>
            <tr>
              <th className="py-3 px-6 text-left">
                <input
                  type="checkbox"
                  className={`rounded transition-colors ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 checked:bg-purple-600'
                      : 'border-gray-300 checked:bg-purple-500'
                  }`}
                  checked={selectedRows.length === paginatedTransactions.length}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedRows(paginatedTransactions.map((t) => t.id));
                    else setSelectedRows([]);
                  }}
                />
              </th>
              <th
                className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date <SortIcon columnKey="date" />
                </div>
              </th>
              <th className={`py-3 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </th>
              <th className={`py-3 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </th>
              <th
                className="py-3 px-6 text-left text-sm font-semibold cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount <SortIcon columnKey="amount" />
                </div>
              </th>
              <th className={`py-3 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </th>
              <th className={`py-3 px-6 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <div className={`flex flex-col items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Wallet className="w-12 h-12 mb-3" />
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm mt-1">
                      {searchTerm || filterType !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "Add your first transaction to get started"}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingTransaction(null);
                        setShowAddForm(true);
                      }}
                      className={`mt-4 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                      }`}
                    >
                      Add Transaction
                    </motion.button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`transition-colors ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}
                >
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      className={`rounded transition-colors ${
                        darkMode
                          ? 'bg-gray-800 border-gray-700 checked:bg-purple-600'
                          : 'border-gray-300 checked:bg-purple-500'
                      }`}
                      checked={selectedRows.includes(transaction.id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedRows([...selectedRows, transaction.id]);
                        else
                          setSelectedRows(
                            selectedRows.filter((id) => id !== transaction.id)
                          );
                      }}
                    />
                  </td>
                  <td className="py-3 px-6">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatDate(transaction.date)}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {transaction.description || "No description"}
                    </p>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-blue-900/30 text-blue-300 border border-blue-800/50"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {transaction.category_name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? darkMode ? "text-green-400" : "text-green-600"
                        : darkMode ? "text-red-400" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "income"
                          ? darkMode 
                            ? "bg-green-900/30 text-green-400 border border-green-800/50"
                            : "bg-green-100 text-green-800 border border-green-200"
                          : darkMode
                          ? "bg-red-900/30 text-red-400 border border-red-800/50"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "text-blue-400 hover:bg-blue-900/30"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Edit"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "text-red-400 hover:bg-red-900/30"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title="Delete"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer & Pagination */}
      <div className={`px-6 py-4 border-t flex flex-col md:flex-row justify-between items-center ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {paginatedTransactions.length} of{" "}
          {filteredTransactions.length} transactions
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 transition-colors ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <Download className="w-4 h-4" /> Export
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </motion.button>
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? darkMode
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500 text-white"
                    : darkMode
                    ? "border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>

      {/* Add/Edit Transaction Form Modal */}
      {showAddForm && (
        <AddTransactionForm
          onClose={() => setShowAddForm(false)}
          onAdd={(data) => {
            if (editingTransaction) {
              updateTransaction(editingTransaction.id, data);
              showNotification("Transaction updated", "success");
            } else {
              addTransaction(data);
              showNotification("Transaction added", "success");
            }
            setShowAddForm(false);
          }}
          initialData={editingTransaction}
        />
      )}
    </motion.div>
  );
};

export default TransactionTable;
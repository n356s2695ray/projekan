import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Bell,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddTransactionForm from "./AddTransactionForm";

const QuickAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const quickActions = [
    { id: "income", label: "Add Income", icon: TrendingUp, color: "green" },
    { id: "expense", label: "Add Expense", icon: TrendingDown, color: "red" },
    { id: "budget", label: "Set Budget", icon: Target, color: "blue" },
    { id: "reminder", label: "Add Reminder", icon: Bell, color: "yellow" },
    { id: "transfer", label: "Transfer", icon: Wallet, color: "purple" },
  ];

  const handleActionClick = (id) => {
    if (id === "income" || id === "expense") {
      setTransactionType(id);

      // Cek apakah sudah di halaman transactions
      if (window.location.pathname !== "/transactions") {
        // Redirect ke transactions dulu
        navigate("/transactions");
        // Tunggu sebentar baru buka form
        setTimeout(() => {
          setShowTransactionForm(true);
        }, 100);
      } else {
        // Langsung buka form
        setShowTransactionForm(true);
      }
    } else {
      // Untuk action lainnya, redirect ke halaman masing-masing
      const routes = {
        budget: "/budgets",
        reminder: "/reminders",
        transfer: "/wallets",
      };
      if (routes[id]) {
        navigate(routes[id]);
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed bottom-6 right-6 z-40">
        {isOpen && (
          <div className="absolute bottom-20 right-0 mb-2 p-4 w-64 rounded-2xl shadow-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">
              Quick Actions
            </h3>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-left"
                >
                  <div
                    className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}
                  >
                    <Icon
                      className={`w-4 h-4 text-${action.color}-600 dark:text-${action.color}-400`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click to add
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {/* MODAL FORM - Tanpa passing onSubmit, biar handle sendiri */}
      {showTransactionForm && (
        <AddTransactionForm
          defaultType={transactionType}
          onClose={() => {
            setShowTransactionForm(false);
            setTransactionType("expense");
          }}
        />
      )}
    </>
  );
};

export default QuickAddButton;

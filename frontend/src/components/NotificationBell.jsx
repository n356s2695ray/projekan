// # Bell Notifikasi untuk Reminder Tagihan
import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  X,
  CheckCheck,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";

const NotificationBell = () => {
  const { darkMode } = useFinance();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "Budget Alert: Food Category",
      message: "You've spent 85% of your food budget this month",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "reminder",
      title: "Bill Payment Due",
      message: "Electricity bill payment due in 2 days",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Savings Goal Reached!",
      message: "You've reached your monthly savings target",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "transaction",
      title: "Large Transaction Detected",
      message: "Transaction of Rp 2,500,000 detected",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 5,
      type: "tip",
      title: "Spending Tip",
      message: "Your entertainment spending is up 20% this month",
      time: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return AlertCircle;
      case "reminder":
        return Calendar;
      case "success":
        return CheckCircle;
      case "transaction":
        return DollarSign;
      case "tip":
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "warning":
        return "text-yellow-500 bg-yellow-500/20";
      case "reminder":
        return "text-blue-500 bg-blue-500/20";
      case "success":
        return "text-green-500 bg-green-500/20";
      case "transaction":
        return "text-purple-500 bg-purple-500/20";
      case "tip":
        return "text-pink-500 bg-pink-500/20";
      default:
        return "text-gray-500 bg-gray-500/20";
    }
  };

  // Auto-mark as read after dropdown is open for 5s
  useEffect(() => {
    if (!showNotifications) return;

    const timer = setTimeout(() => {
      markAllAsRead();
    }, 5000);

    return () => clearTimeout(timer);
  }, [showNotifications]);

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-2 rounded-xl transition-all
          ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <div
          className={`absolute right-0 mt-2 w-96 z-50 rounded-2xl shadow-2xl border ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5" />
              <h3 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className={`p-2 rounded-lg hover:bg-gray-700/50 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <CheckCheck className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowNotifications(false)}
                className={`p-2 rounded-lg hover:bg-gray-700/50 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-700">
            {notifications.length ? (
              notifications.map((n) => {
                const Icon = getIcon(n.type);
                const colors = getColor(n.type);

                return (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors ${
                      !n.read
                        ? darkMode
                          ? "bg-gray-800/50"
                          : "bg-blue-50/50"
                        : "hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${colors}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {n.title}
                          </h4>
                          {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                        </div>

                        <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {n.message}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">{n.time}</span>

                          <div className="flex items-center space-x-2">
                            {!n.read && (
                              <button
                                onClick={() => markAsRead(n.id)}
                                className={`text-xs px-3 py-1 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                              >
                                Mark as read
                              </button>
                            )}

                            <button
                              onClick={() => deleteNotification(n.id)}
                              className={`p-1 rounded-lg hover:bg-red-500/20 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  No notifications
                </h4>
                <p className="text-sm text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setShowNotifications(false)}
              className={`text-sm font-medium ${
                darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              View all notifications
            </button>
            <button
              onClick={() => setShowNotifications(false)}
              className={`text-sm ${
                darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Notification settings
            </button>
          </div>
        </div>
      )}

      {/* Overlay (click outside to close) */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default NotificationBell;

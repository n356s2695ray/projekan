import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Bell,
  Plus,
  Clock,
  DollarSign,
  CreditCard,
  Car,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { darkModeManager } from "../utils/darkModeManager";

const Reminders = () => {
  const [isDarkMode, setIsDarkMode] = useState(darkModeManager.getDarkMode());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setIsDarkMode);
    return () => unsubscribe();
  }, []);

  const reminders = [
    {
      id: 1,
      title: "Electricity Bill",
      amount: 450000,
      dueDate: new Date(Date.now() + 86400000 * 2),
      category: "bills",
      recurring: "monthly",
      status: "upcoming",
      priority: "high",
      description: "Monthly electricity bill payment",
    },
    {
      id: 2,
      title: "Netflix Subscription",
      amount: 149000,
      dueDate: new Date(Date.now() + 86400000 * 5),
      category: "entertainment",
      recurring: "monthly",
      status: "upcoming",
      priority: "medium",
      description: "Monthly subscription renewal",
    },
    {
      id: 3,
      title: "Car Insurance",
      amount: 1250000,
      dueDate: new Date(Date.now() - 86400000),
      category: "transport",
      recurring: "yearly",
      status: "overdue",
      priority: "high",
      description: "Annual car insurance payment",
    },
    {
      id: 4,
      title: "Internet Bill",
      amount: 350000,
      dueDate: new Date(Date.now() + 86400000 * 7),
      category: "bills",
      recurring: "monthly",
      status: "upcoming",
      priority: "medium",
      description: "Monthly internet service fee",
    },
    {
      id: 5,
      title: "Credit Card Payment",
      amount: 2250000,
      dueDate: new Date(Date.now() + 86400000 * 3),
      category: "bills",
      recurring: "monthly",
      status: "upcoming",
      priority: "high",
      description: "Monthly credit card statement",
    },
    {
      id: 6,
      title: "Gym Membership",
      amount: 299000,
      dueDate: new Date(Date.now() + 86400000 * 10),
      category: "health",
      recurring: "monthly",
      status: "upcoming",
      priority: "low",
      description: "Monthly gym membership fee",
    },
  ];

  const categories = {
    bills: { name: "Bills", color: "#EF4444", icon: CreditCard },
    entertainment: { name: "Entertainment", color: "#8B5CF6", icon: Bell },
    transport: { name: "Transport", color: "#3B82F6", icon: Car },
    health: { name: "Health", color: "#06B6D4", icon: Heart },
    food: { name: "Food", color: "#10B981", icon: DollarSign },
  };

  const getCategoryColorClass = (category) => {
    switch (category) {
      case "bills":
        return "text-red-500";
      case "entertainment":
        return "text-purple-500";
      case "transport":
        return "text-blue-500";
      case "health":
        return "text-cyan-500";
      case "food":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getCategoryBgColorClass = (category) => {
    switch (category) {
      case "bills":
        return "bg-red-500/20";
      case "entertainment":
        return "bg-purple-500/20";
      case "transport":
        return "bg-blue-500/20";
      case "health":
        return "bg-cyan-500/20";
      case "food":
        return "bg-green-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  const filteredReminders = reminders.filter((reminder) => {
    if (filter === "all") return true;
    if (filter === "overdue") return reminder.status === "overdue";
    if (filter === "upcoming") return reminder.status === "upcoming";
    if (filter === "paid") return reminder.status === "paid";
    return reminder.category === filter;
  });

  const stats = {
    total: reminders.length,
    overdue: reminders.filter((r) => r.status === "overdue").length,
    upcoming: reminders.filter((r) => r.status === "upcoming").length,
    totalAmount: reminders.reduce((sum, r) => sum + r.amount, 0),
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  // Calendar functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getMonthName = (month) => {
    return new Date(selectedYear, month).toLocaleString("default", {
      month: "long",
    });
  };

  const getRemindersForDate = (day) => {
    const date = new Date(selectedYear, selectedMonth, day);
    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.dueDate);
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p
            className={`transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading reminders...
          </p>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
  const today = new Date();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
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
              Bill Reminders
            </h1>
            <p
              className={`mt-2 transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Never miss a payment with smart reminders
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddReminder(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                text-white rounded-xl hover:opacity-90 transition-opacity 
                flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className={`p-6 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-500 mb-1">
            {stats.total}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Reminders
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
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Overdue
            </span>
          </div>
          <div className="text-2xl font-bold text-red-500 mb-1">
            {stats.overdue}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Need attention
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
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Upcoming
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-500 mb-1">
            {stats.upcoming}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            This month
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
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span
              className={`text-sm transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Amount
            </span>
          </div>
          <div className="text-2xl font-bold text-green-500 mb-1">
            {formatCurrency(stats.totalAmount)}
          </div>
          <div
            className={`text-sm transition-colors ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            All reminders
          </div>
        </div>
      </div>

      {/* Filters and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div
          className={`lg:col-span-1 rounded-2xl border transition-colors ${
            isDarkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-200"
          } p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-xl font-bold transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Calendar
            </h3>
            <CalendarIcon
              className={`w-5 h-5 transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </div>

          {/* Mini Calendar */}
          <div
            className={`rounded-xl p-4 transition-colors ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700/50 text-gray-300"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div
                className={`font-semibold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {getMonthName(selectedMonth)} {selectedYear}
              </div>
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700/50 text-gray-300"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium transition-colors ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="relative">
                  {day && (
                    <button
                      className={`w-full h-8 rounded-lg text-sm transition-colors relative ${
                        day === selectedDate.getDate() &&
                        selectedMonth === today.getMonth() &&
                        selectedYear === today.getFullYear()
                          ? "bg-purple-500 text-white"
                          : day === today.getDate() &&
                            selectedMonth === today.getMonth() &&
                            selectedYear === today.getFullYear()
                          ? "bg-purple-500/20 text-purple-600"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedDate(
                          new Date(selectedYear, selectedMonth, day)
                        );
                      }}
                    >
                      {day}
                      {getRemindersForDate(day).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Date Reminders */}
          <div className="mt-6">
            <h4
              className={`font-medium mb-3 transition-colors ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {formatDate(selectedDate)}
            </h4>
            <div className="space-y-2">
              {getRemindersForDate(selectedDate.getDate()).length > 0 ? (
                getRemindersForDate(selectedDate.getDate()).map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full`}
                        style={{
                          backgroundColor: categories[reminder.category]?.color,
                        }}
                      ></div>
                      <span
                        className={`text-sm transition-colors ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {reminder.title}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(reminder.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p
                    className={`text-sm transition-colors ${
                      isDarkMode ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    No reminders for this date
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="lg:col-span-2">
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
                  All Reminders
                </h3>
                <p
                  className={`mt-1 transition-colors ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track and manage your bills and payments
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`flex rounded-xl p-1 transition-colors ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  {["all", "overdue", "upcoming", "paid"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        filter === f
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

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

            {/* Reminders Table */}
            <div className="space-y-4">
              {filteredReminders.length > 0 ? (
                filteredReminders.map((reminder) => {
                  const category = categories[reminder.category];
                  const CategoryIcon = category?.icon || DollarSign;

                  return (
                    <div
                      key={reminder.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } ${
                        reminder.status === "overdue"
                          ? "bg-red-500/10 border-red-500/30"
                          : reminder.status === "paid"
                          ? "bg-green-500/10 border-green-500/30"
                          : "hover:bg-gray-800/5 dark:hover:bg-gray-800/20"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-lg ${
                              reminder.status === "overdue"
                                ? "bg-red-500/20"
                                : reminder.status === "paid"
                                ? "bg-green-500/20"
                                : getCategoryBgColorClass(reminder.category)
                            }`}
                          >
                            <CategoryIcon
                              className={`w-6 h-6 transition-colors ${
                                reminder.status === "overdue"
                                  ? "text-red-500"
                                  : reminder.status === "paid"
                                  ? "text-green-500"
                                  : getCategoryColorClass(reminder.category)
                              }`}
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                              <h4
                                className={`font-semibold transition-colors ${
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {reminder.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                {reminder.priority === "high" && (
                                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                    High Priority
                                  </span>
                                )}
                                {reminder.status === "overdue" && (
                                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                    Overdue
                                  </span>
                                )}
                                {reminder.status === "paid" && (
                                  <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                    Paid
                                  </span>
                                )}
                              </div>
                            </div>

                            <p
                              className={`text-sm mb-3 transition-colors ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {reminder.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span
                                  className={`text-sm transition-colors ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {formatDate(reminder.dueDate)}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span
                                  className={`text-sm transition-colors ${
                                    reminder.status === "overdue"
                                      ? "text-red-500"
                                      : reminder.status === "paid"
                                      ? "text-green-500"
                                      : isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {getDaysUntilDue(reminder.dueDate)}
                                </span>
                              </div>

                              <span
                                className={`text-sm px-2 py-1 rounded-full transition-colors ${
                                  isDarkMode
                                    ? "bg-gray-800 text-gray-400"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {reminder.recurring}
                              </span>

                              <span
                                className={`text-sm px-2 py-1 rounded-full transition-colors ${
                                  isDarkMode
                                    ? "bg-gray-800 text-gray-400"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {category?.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 lg:flex-col lg:items-end lg:space-x-0 lg:space-y-2">
                          <div className="text-right mb-2 sm:mb-0">
                            <div
                              className={`text-xl font-bold transition-colors ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {formatCurrency(reminder.amount)}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {reminder.status !== "paid" && (
                              <button
                                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 
                                transition-colors text-sm"
                              >
                                Mark Paid
                              </button>
                            )}

                            <div className="relative">
                              <button
                                className={`p-2 rounded-lg transition-colors ${
                                  isDarkMode
                                    ? "hover:bg-gray-700 text-gray-400"
                                    : "hover:bg-gray-200 text-gray-600"
                                }`}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                    }`}
                  >
                    <Bell className="w-8 h-8 text-gray-500" />
                  </div>
                  <h4
                    className={`text-lg font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    No reminders found
                  </h4>
                  <p
                    className={`transition-colors ${
                      isDarkMode ? "text-gray-500" : "text-gray-600"
                    } mb-6`}
                  >
                    {filter !== "all"
                      ? "Try changing your filter"
                      : "Add your first reminder to get started"}
                  </p>
                  <button
                    onClick={() => setShowAddReminder(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                      text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Add First Reminder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminder && (
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
                Add New Reminder
              </h3>
              <button
                onClick={() => setShowAddReminder(false)}
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
                  Bill Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="e.g., Electricity Bill"
                />
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
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder="Enter amount"
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
                    Due Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="">Select category</option>
                    {Object.entries(categories).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Recurring
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="none">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Priority
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddReminder(false)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity">
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;

import React, { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Moon,
  Sun,
  CreditCard,
  Shield,
  User,
  Globe,
  Palette,
  Smartphone,
  Database,
  BellOff,
  BellRing,
  Lock,
  Eye,
  EyeOff,
  Volume2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Clock,
  Mail,
  Smartphone as SmartphoneIcon,
  Database as DatabaseIcon,
  Bell as BellIcon,
  CheckCircle,
  XCircle,
  FileText,
  Share,
  Megaphone,
  Download,
  Trash2,
  Plus,
  DollarSign,
  Calendar,
  Share as ShareIcon,
} from "lucide-react";
import { darkModeManager } from "../utils/darkModeManager";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => darkModeManager.getDarkMode());
  const [isInitialized, setIsInitialized] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    billingReminders: true,
    budgetAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
    
    // Appearance
    currency: "IDR",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    themeColor: "purple",
    
    // Privacy & Security
    dataSharing: false,
    analyticsTracking: true,
    personalizedAds: false,
    twoFactorAuth: false,
    autoLogout: 30,
    showRecentTransactions: true,
    
    // Account
    emailUpdates: true,
    marketingEmails: false,
    
    // Billing
    autoRenew: true,
    paperlessBilling: true,
  });

  const [activeTab, setActiveTab] = useState("notifications");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize dark mode subscription
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    
    // Load saved settings
    const savedSettings = localStorage.getItem("smartspend_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
    
    setIsInitialized(true);
    return unsubscribe;
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggleDarkMode = () => {
    darkModeManager.toggleDarkMode();
  };

  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("smartspend_settings", JSON.stringify(settings));
      
      // Show success message
      setShowSaveSuccess(true);
      setIsSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }, 500);
  };

  const tabs = [
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell,
      color: "from-blue-500 to-cyan-500",
      count: 5
    },
    { 
      id: "appearance", 
      label: "Appearance", 
      icon: Palette,
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: "privacy", 
      label: "Privacy", 
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: "account", 
      label: "Account", 
      icon: User,
      color: "from-orange-500 to-amber-500"
    },
    { 
      id: "billing", 
      label: "Billing", 
      icon: CreditCard,
      color: "from-red-500 to-rose-500"
    },
  ];

  const currencyOptions = [
    { value: "IDR", label: "Indonesian Rupiah (Rp)", symbol: "Rp" },
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "EUR", label: "Euro (€)", symbol: "€" },
    { value: "GBP", label: "British Pound (£)", symbol: "£" },
    { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
    { value: "SGD", label: "Singapore Dollar (S$)", symbol: "S$" },
  ];

  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { value: "es", label: "Spanish", flag: "🇪🇸" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "de", label: "German", flag: "🇩🇪" },
    { value: "zh", label: "Chinese", flag: "🇨🇳" },
  ];

  const themeColors = [
    { name: "Purple", value: "purple", bg: "bg-gradient-to-r from-purple-500 to-violet-500", text: "text-purple-500" },
    { name: "Blue", value: "blue", bg: "bg-gradient-to-r from-blue-500 to-cyan-500", text: "text-blue-500" },
    { name: "Green", value: "green", bg: "bg-gradient-to-r from-green-500 to-emerald-500", text: "text-green-500" },
    { name: "Red", value: "red", bg: "bg-gradient-to-r from-red-500 to-rose-500", text: "text-red-500" },
    { name: "Orange", value: "orange", bg: "bg-gradient-to-r from-orange-500 to-amber-500", text: "text-orange-500" },
    { name: "Pink", value: "pink", bg: "bg-gradient-to-r from-pink-500 to-rose-500", text: "text-pink-500" },
  ];

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header dengan Animasi */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-xl ${
          darkMode
            ? "bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700"
            : "bg-gradient-to-r from-white to-gray-50 border border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}>
                <Palette className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Settings
                </h1>
                <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Customize your SmartSpend experience
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {showSaveSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    darkMode
                      ? "bg-green-900/20 text-green-400 border border-green-700/30"
                      : "bg-green-50 text-green-600 border border-green-200"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Settings saved!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveSettings}
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSaving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className={`rounded-2xl border shadow-lg ${
            darkMode
              ? "bg-gray-900/50 border-gray-700"
              : "bg-white border-gray-200"
          } p-4`}>
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? darkMode
                          ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
                          : "bg-gradient-to-r from-gray-50 to-white border border-gray-300 shadow-sm"
                        : darkMode
                        ? "hover:bg-gray-800/50 text-gray-400 hover:text-white"
                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${tab.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.count && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Dark Mode Toggle Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`mt-6 p-4 rounded-xl border shadow-sm ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}>
                    {darkMode ? (
                      <Moon className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {darkMode ? "Switch to light" : "Switch to dark"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleToggleDarkMode}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    darkMode ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700/30 dark:border-gray-300/30">
                <div className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Currently using: <span className="font-semibold">{darkMode ? "Dark" : "Light"} theme</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className={`rounded-2xl border shadow-lg ${
              darkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white border-gray-200"
            } p-6`}>
              <div className="space-y-6">
                <div>
                  <h2 className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Notification Preferences
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Choose how and when you want to be notified
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive important updates via email",
                      icon: Mail,
                      color: "text-blue-500",
                      bgColor: "bg-blue-500/20",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      description: "Get instant notifications on your device",
                      icon: BellIcon,
                      color: "text-green-500",
                      bgColor: "bg-green-500/20",
                    },
                    {
                      key: "billingReminders",
                      label: "Billing Reminders",
                      description: "Reminders for upcoming bills and payments",
                      icon: CreditCard,
                      color: "text-purple-500",
                      bgColor: "bg-purple-500/20",
                    },
                    {
                      key: "budgetAlerts",
                      label: "Budget Alerts",
                      description: "Alerts when approaching budget limits",
                      icon: AlertTriangle,
                      color: "text-amber-500",
                      bgColor: "bg-amber-500/20",
                    },
                    {
                      key: "weeklyReports",
                      label: "Weekly Reports",
                      description: "Receive weekly spending summaries",
                      icon: FileText,
                      color: "text-cyan-500",
                      bgColor: "bg-cyan-500/20",
                    },
                    {
                      key: "monthlyReports",
                      label: "Monthly Reports",
                      description: "Detailed monthly financial reports",
                      icon: DatabaseIcon,
                      color: "text-indigo-500",
                      bgColor: "bg-indigo-500/20",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.key}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                          darkMode
                            ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${item.bgColor}`}>
                            <Icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <div>
                            <div className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-sm mt-1 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange(item.key, !settings[item.key])}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                            settings[item.key]
                              ? darkMode
                                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                              : darkMode
                              ? "bg-gray-700"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              settings[item.key] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className={`rounded-2xl border shadow-lg ${
              darkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white border-gray-200"
            } p-6`}>
              <div className="space-y-6">
                <div>
                  <h2 className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Display Settings
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Customize how your dashboard looks and feels
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency Selector */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Default Currency
                      </div>
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange("currency", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/30"
                          : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.flag} {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      All amounts will be displayed in this currency
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Language
                      </div>
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/30"
                          : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.flag} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Format
                      </div>
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/30"
                          : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                    </select>
                  </div>

                  {/* Time Format */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time Format
                      </div>
                    </label>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => handleSettingChange("timeFormat", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/30"
                          : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20"
                      } focus:outline-none focus:ring-2`}
                    >
                      <option value="24-hour">24-hour format (14:30)</option>
                      <option value="12-hour">12-hour format (2:30 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Theme Colors */}
                <div className="mt-8">
                  <h3 className={`text-lg font-medium mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Theme Colors
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {themeColors.map((color) => (
                      <motion.button
                        key={color.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSettingChange("themeColor", color.value)}
                        className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                          settings.themeColor === color.value
                            ? darkMode
                              ? "border-purple-500 bg-gray-800 shadow-lg"
                              : "border-purple-500 bg-purple-50 shadow-lg"
                            : darkMode
                            ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full ${color.bg} mb-3 shadow-md`}></div>
                        <span className={`font-medium text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {color.name}
                        </span>
                        {settings.themeColor === color.value && (
                          <CheckCircle className={`w-5 h-5 mt-2 ${color.text}`} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className={`rounded-2xl border shadow-lg ${
              darkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white border-gray-200"
            } p-6`}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                    <div>
                      <h2 className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Privacy & Security
                      </h2>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage your data privacy and security settings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "twoFactorAuth",
                      label: "Two-Factor Authentication",
                      description: "Add an extra layer of security to your account",
                      icon: Shield,
                      color: "text-green-500",
                      bgColor: "bg-green-500/20",
                    },
                    {
                      key: "showRecentTransactions",
                      label: "Show Recent Transactions",
                      description: "Display recent transactions on dashboard",
                      icon: Eye,
                      color: "text-blue-500",
                      bgColor: "bg-blue-500/20",
                    },
                    {
                      key: "analyticsTracking",
                      label: "Analytics Tracking",
                      description: "Allow tracking for personalized insights",
                      icon: DatabaseIcon,
                      color: "text-purple-500",
                      bgColor: "bg-purple-500/20",
                    },
                    {
                      key: "dataSharing",
                      label: "Data Sharing",
                      description: "Share anonymous data to improve our service",
                      icon: Share,
                      color: "text-amber-500",
                      bgColor: "bg-amber-500/20",
                    },
                    {
                      key: "personalizedAds",
                      label: "Personalized Ads",
                      description: "Show ads based on your interests",
                      icon: Megaphone,
                      color: "text-pink-500",
                      bgColor: "bg-pink-500/20",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${item.bgColor}`}>
                            <Icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <div>
                            <div className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {item.label}
                            </div>
                            <div className={`text-sm mt-1 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange(item.key, !settings[item.key])}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                            settings[item.key]
                              ? darkMode
                                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                : "bg-gradient-to-r from-green-500 to-emerald-500"
                              : darkMode
                              ? "bg-gray-700"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              settings[item.key] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Auto Logout */}
                <div className={`mt-6 p-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Auto Logout Timer
                      </div>
                      <div className={`text-sm mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Automatically logout after {settings.autoLogout} minutes of inactivity
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {settings.autoLogout} min
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={settings.autoLogout}
                    onChange={(e) =>
                      handleSettingChange("autoLogout", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>1 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                    <span>120 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className={`rounded-2xl border shadow-lg ${
              darkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white border-gray-200"
            } p-6`}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-8 h-8 text-blue-500" />
                    <div>
                      <h2 className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Account Settings
                      </h2>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage your account preferences and email settings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailUpdates",
                      label: "Email Updates",
                      description: "Receive account updates and news via email",
                      icon: Mail,
                      color: "text-blue-500",
                      bgColor: "bg-blue-500/20",
                    },
                    {
                      key: "marketingEmails",
                      label: "Marketing Emails",
                      description: "Receive promotional offers and updates",
                      icon: Megaphone,
                      color: "text-pink-500",
                      bgColor: "bg-pink-500/20",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        darkMode
                          ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.bgColor}`}>
                          <Mail className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <div className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-sm mt-1 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(item.key, !settings[item.key])}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          settings[item.key]
                            ? darkMode
                              ? "bg-gradient-to-r from-green-600 to-emerald-600"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                            : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings[item.key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Account Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <button className={`p-4 rounded-xl border text-left transition-colors ${
                    darkMode
                      ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Export Data
                        </div>
                        <div className={`text-sm mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Download all your data
                        </div>
                      </div>
                    </div>
                  </button>

                  <button className={`p-4 rounded-xl border text-left transition-colors ${
                    darkMode
                      ? "border-red-700/50 hover:border-red-600 hover:bg-red-900/20"
                      : "border-red-200 hover:border-red-300 hover:bg-red-50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <div>
                        <div className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Delete Account
                        </div>
                        <div className={`text-sm mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          Permanently delete your account
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className={`rounded-2xl border shadow-lg ${
              darkMode
                ? "bg-gray-900/50 border-gray-700"
                : "bg-white border-gray-200"
            } p-6`}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-purple-500" />
                    <div>
                      <h2 className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Billing & Subscription
                      </h2>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage your subscription and payment methods
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "autoRenew",
                      label: "Auto-Renew Subscription",
                      description: "Automatically renew your subscription",
                      icon: RefreshCw,
                      color: "text-green-500",
                      bgColor: "bg-green-500/20",
                    },
                    {
                      key: "paperlessBilling",
                      label: "Paperless Billing",
                      description: "Receive bills electronically only",
                      icon: FileText,
                      color: "text-blue-500",
                      bgColor: "bg-blue-500/20",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        darkMode
                          ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.bgColor}`}>
                          <RefreshCw className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <div className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-sm mt-1 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSettingChange(item.key, !settings[item.key])}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          settings[item.key]
                            ? darkMode
                              ? "bg-gradient-to-r from-green-600 to-emerald-600"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                            : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings[item.key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Payment Methods */}
                <div className={`mt-6 p-4 rounded-xl border ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <h3 className={`font-medium mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Payment Methods
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">Visa ending in 4321</div>
                          <div className="text-sm text-gray-500">Expires 12/25</div>
                        </div>
                      </div>
                      <button className="text-sm text-purple-500 hover:text-purple-600">
                        Edit
                      </button>
                    </div>
                    <button className={`w-full py-3 rounded-lg border-2 border-dashed transition-colors ${
                      darkMode
                        ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span>Add Payment Method</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Import icons yang belum di-impor
export default Settings;
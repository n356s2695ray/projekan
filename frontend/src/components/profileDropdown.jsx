import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Wallet,
  Moon,
  Sun,
  Sparkles,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { darkModeManager } from "../utils/darkModeManager"; // Import manager

const ProfileDropdown = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);
  // Get user data
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Izhar Maulana",
    email: "izhar@financepro.com",
    role: "Premium Member",
    plan: "Enterprise",
    joinDate: "2023-01-15",
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setTimeout(() => setActiveTab("main"), 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setIsOpen(false);
  };

const handleToggleDarkMode = () => {
  darkModeManager.toggleDarkMode();
};
  const mainMenuItems = [
    {
      icon: User,
      label: "My Profile",
      description: "Personal information",
      action: () => {
        navigate("/profile");
        setIsOpen(false);
      },
      badge: null,
    },
    {
      icon: Wallet,
      label: "My Wallet",
      description: "Manage balances",
      action: () => {
        navigate("/wallet");
        setIsOpen(false);
      },
      badge: "3",
    },
    {
      icon: CreditCard,
      label: "Billing",
      description: "Payment methods",
      action: () => {
        navigate("/billing");
        setIsOpen(false);
      },
      badge: null,
    },
    {
      icon: ShieldCheck,
      label: "Security",
      description: "Privacy & protection",
      action: () => {
        navigate("/security");
        setIsOpen(false);
      },
      badge: "Verified",
    },
  ];

  const settingsMenuItems = [
    {
      icon: Settings,
      label: "Account Settings",
      action: () => {
        navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      icon: Bell,
      label: "Notifications",
      action: () => {
        navigate("/notifications");
        setIsOpen(false);
      },
      badge: "12",
    },
    {
      icon: darkMode ? Sun : Moon,
      label: darkMode ? "Light Mode" : "Dark Mode",
      action: handleToggleDarkMode,
      toggle: true,
      value: darkMode,
    },
    {
      icon: Globe,
      label: "Language",
      action: () => {
        navigate("/language");
        setIsOpen(false);
      },
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      action: () => {
        navigate("/support");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:shadow-md group
          ${
            darkMode
              ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
      >
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-50 ${
              darkMode
                ? "bg-gradient-to-br from-blue-600 to-purple-600"
                : "bg-gradient-to-br from-blue-500 to-purple-500"
            }`}
          ></div>
          <div
            className={`relative w-9 h-9 rounded-full flex items-center justify-center border-2 ${
              darkMode ? "border-blue-500/30" : "border-blue-500/20"
            }`}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm ${
                darkMode
                  ? "bg-gradient-to-br from-blue-700 to-purple-700"
                  : "bg-gradient-to-br from-blue-600 to-purple-600"
              }`}
            >
              {user.name?.charAt(0) || "U"}
            </div>
            <Sparkles className="absolute -bottom-1 -right-1 w-3 h-3 text-yellow-300" />
          </div>
        </div>

        <div className="text-left hidden lg:block">
          <p
            className={`font-semibold text-sm ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {user.name?.split(" ")[0] || "User"}
          </p>
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Premium Member
          </p>
        </div>

        <ChevronRight
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Profile Header */}
            <div
              className={`p-6 ${
                darkMode
                  ? "bg-gray-800/50"
                  : "bg-gradient-to-br from-blue-50 to-purple-50"
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-full blur-lg opacity-50 ${
                      darkMode
                        ? "bg-gradient-to-br from-blue-600 to-purple-600"
                        : "bg-gradient-to-br from-blue-500 to-purple-500"
                    }`}
                  ></div>
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                      darkMode ? "border-blue-500/30" : "border-blue-500/20"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        darkMode
                          ? "bg-gradient-to-br from-blue-700 to-purple-700"
                          : "bg-gradient-to-br from-blue-600 to-purple-600"
                      }`}
                    >
                      {user.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full border-2 border-white dark:border-gray-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-lg truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </h3>
                  <p
                    className={`text-sm truncate mb-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        darkMode
                          ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-300 border border-blue-700/50"
                          : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 border border-blue-200"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {user.plan}
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Member since {new Date(user.joinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("main")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "main"
                      ? darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900 shadow-sm"
                      : darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Quick Menu
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? darkMode
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-900 shadow-sm"
                      : darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="max-h-96 overflow-y-auto">
              {activeTab === "main" ? (
                // Main Menu
                <div className="p-4">
                  {mainMenuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all duration-200 hover:shadow-sm ${
                        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              darkMode ? "text-blue-400" : "text-blue-500"
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {item.label}
                          </p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              darkMode
                                ? "bg-blue-900/30 text-blue-300"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                // Settings Menu
                <div className="p-4">
                  {settingsMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 transition-colors ${
                        darkMode
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        >
                          <item.icon
                            className={`w-4 h-4 ${
                              item.toggle && darkMode
                                ? "text-yellow-400"
                                : item.toggle
                                ? "text-gray-700"
                                : darkMode
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              darkMode
                                ? "bg-red-900/30 text-red-400"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.toggle ? (
                          <div
                            className={`w-10 h-6 rounded-full relative transition-colors ${
                              item.value
                                ? darkMode
                                  ? "bg-blue-500"
                                  : "bg-blue-500"
                                : darkMode
                                ? "bg-gray-700"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                item.value ? "right-1" : "left-1"
                              }`}
                            ></div>
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Logout Section */}
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-md ${
                    darkMode
                      ? "bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-400 hover:bg-red-900/40 border border-red-800/50"
                      : "bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:bg-red-100 border border-red-200"
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;

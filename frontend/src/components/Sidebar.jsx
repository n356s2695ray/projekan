import React, { useState, useEffect } from "react";
import {
  Home,
  PieChart,
  CreditCard,
  Settings,
  Bell,
  Wallet,
  TrendingUp,
  BarChart3,
  DollarSign,
  Shield,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { darkModeManager } from "../utils/darkModeManager"; // Import manager

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      badge: null,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCard,
      label: "Transactions",
      path: "/Transactions",
      badge: "12",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: PieChart,
      label: "Analytics",
      path: "/Analytics",
      badge: "New",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: BarChart3,
      label: "Budgets",
      path: "/Budgets",
      badge: "3",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Wallet,
      label: "Wallets",
      path: "/Wallets",
      badge: null,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Investments",
      path: "/Investments",
      badge: "Active",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  const bottomMenuItems = [
    { icon: Bell, label: "Reminders", path: "/Reminders", badge: "3" },
    { icon: Settings, label: "Settings", path: "/Settings" },
  ];

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "John Doe",
    email: "john@example.com",
    role: "Premium",
  };

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Desktop: sidebar selalu terbuka
        setIsCollapsed(false); // Desktop: default tidak collapsed
      } else {
        setIsOpen(false); // Mobile: sidebar tertutup
        setIsCollapsed(false); // Mobile: tidak collapsed
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tutup sidebar mobile saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, isOpen]);

  // Toggle sidebar untuk mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Toggle collapse untuk desktop
  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Lebar sidebar berdasarkan state
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`sidebar-toggle fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-all lg:hidden ${
          darkMode
            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black lg:hidden z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
        }}
        transition={{ duration: 0.3 }}
        className={`sidebar fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300
          ${
            darkMode
              ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-white via-gray-50 to-gray-100"
          } shadow-2xl border-r ${
          darkMode ? "border-gray-800/50" : "border-gray-200/50"
        }
          ${isOpen ? sidebarWidth : "w-0 overflow-hidden"}
          ${!isMobile ? "translate-x-0" : ""}`}
      >
        {/* Logo Section */}
        <div
          className={`p-4 ${isCollapsed ? "px-3" : "px-6"} border-b ${
            darkMode ? "border-gray-800/50" : "border-gray-200/50"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {/* Logo */}
            <div
              className={`flex items-center ${isCollapsed ? "" : "space-x-3"}`}
            >
              <div
                className={`relative rounded-2xl flex items-center justify-center shadow-2xl ${
                  isCollapsed ? "w-10 h-10" : "w-12 h-12"
                } ${
                  darkMode
                    ? "bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700"
                    : "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600"
                }`}
              >
                <DollarSign
                  className={`${
                    isCollapsed ? "w-5 h-5" : "w-6 h-6"
                  } text-white`}
                />
                <Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-yellow-300" />
              </div>

              {/* Logo Text */}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h1
                    className={`text-lg font-bold tracking-tight truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Rcane't<span className="text-blue-500">Finance</span>
                  </h1>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        darkMode
                          ? "bg-green-900/30 text-green-400 border border-green-800/50"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}
                    >
                      <Zap className="w-2.5 h-2.5 inline mr-1" />
                      PRO
                    </span>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      v2.1.0
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button - Desktop Only */}
            {!isCollapsed && !isMobile && (
              <button
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Navigation Label */}
          {!isCollapsed && (
            <p
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Navigation
            </p>
          )}

          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <div key={index} className="relative">
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className={`absolute left-full ml-2 px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap
                    ${
                      darkMode
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-gray-900 border border-gray-200"
                    }
                    opacity-0 hover:opacity-100 transition-opacity pointer-events-none
                    ${hoveredItem === index ? "opacity-100" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient}`}
                      >
                        <item.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <Link
                  to={item.path}
                  onClick={() => isMobile && setIsOpen(false)}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } 
                    px-3 py-3 rounded-xl transition-all duration-200 mb-1
                    ${
                      isActive
                        ? darkMode
                          ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/30 shadow-lg shadow-blue-500/10"
                          : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg shadow-blue-500/10"
                        : darkMode
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-100/80"
                    }`}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "" : "space-x-3"
                    }`}
                  >
                    <div
                      className={`relative rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                      ${isCollapsed ? "w-9 h-9" : "w-9 h-9"}
                      ${
                        isActive
                          ? `bg-gradient-to-br ${item.gradient} shadow-md`
                          : darkMode
                          ? "bg-gray-800"
                          : "bg-gray-100"
                      }`}
                    >
                      <item.icon
                        className={`${isCollapsed ? "w-4 h-4" : "w-4 h-4"} ${
                          isActive
                            ? "text-white"
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Label */}
                    {!isCollapsed && (
                      <span
                        className={`font-medium ${
                          isActive
                            ? darkMode
                              ? "text-blue-300"
                              : "text-blue-600"
                            : darkMode
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Badge & Arrow */}
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            darkMode
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight
                          className={`w-4 h-4 ${
                            darkMode ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                      )}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="px-2 py-3 space-y-1">
          {bottomMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "justify-between"
                } 
                  px-3 py-2.5 rounded-xl transition-colors
                  ${
                    isActive
                      ? darkMode
                        ? "bg-gray-800 text-blue-400"
                        : "bg-gray-100 text-blue-600"
                      : darkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? "" : "space-x-3"
                  }`}
                >
                  <div
                    className={`${
                      isCollapsed ? "w-8 h-8" : "w-8 h-8"
                    } rounded-lg flex items-center justify-center ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`${isCollapsed ? "w-4 h-4" : "w-4 h-4"}`}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      darkMode
                        ? "bg-red-900/30 text-red-400"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-800/50" : "border-gray-200/50"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="relative">
              <div
                className={`relative ${
                  isCollapsed ? "w-10 h-10" : "w-12 h-12"
                } rounded-full flex items-center justify-center border-2 ${
                  darkMode ? "border-blue-500/30" : "border-blue-500/20"
                }`}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold ${
                    darkMode
                      ? "bg-gradient-to-br from-blue-700 to-purple-700"
                      : "bg-gradient-to-br from-blue-600 to-purple-600"
                  }`}
                >
                  {user.name?.charAt(0) || "U"}
                </div>
              </div>
              <Shield className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-900" />
            </div>

            {/* User Info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name || "User"}
                </p>
                <p
                  className={`text-sm truncate ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.role || "Premium User"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Expand Button when collapsed - Desktop Only */}
        {isCollapsed && !isMobile && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={toggleCollapse}
              className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;

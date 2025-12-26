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
  Coins,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { darkModeManager } from "../utils/darkModeManager";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState(false);
  const [textAnimation, setTextAnimation] = useState(false);
  const [coins, setCoins] = useState([]);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  // Generate floating coins
  useEffect(() => {
    const newCoins = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.2,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
    }));
    setCoins(newCoins);
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
        setIsOpen(true);
        setIsCollapsed(false);
      } else {
        setIsOpen(false);
        setIsCollapsed(false);
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

  // Trigger animations on mount
  useEffect(() => {
    setTimeout(() => {
      setLogoAnimation(true);
    }, 500);

    setTimeout(() => {
      setTextAnimation(true);
    }, 1000);
  }, []);

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
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 25,
        }}
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
          } relative overflow-hidden`}
        >
          {/* Floating Coins Background Animation */}
          {!isCollapsed &&
            coins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{
                  x: coin.x + "%",
                  y: coin.y + "%",
                  opacity: 0,
                  scale: 0,
                  rotate: coin.rotation,
                }}
                animate={{
                  y: [coin.y + "%", coin.y - 20 + "%", coin.y + "%"],
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  rotate: coin.rotation + 360,
                }}
                transition={{
                  duration: 4,
                  delay: coin.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3 + 2,
                  ease: "easeInOut",
                }}
                className="absolute pointer-events-none"
                style={{
                  left: `${coin.x}%`,
                  top: `${coin.y}%`,
                }}
              >
                <Coins
                  className="text-amber-400/30"
                  style={{ width: coin.size, height: coin.size }}
                />
              </motion.div>
            ))}

          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {/* Animated Logo */}
            <motion.div
              initial={false}
              animate={
                logoAnimation
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
              className={`relative ${
                isCollapsed ? "" : "flex items-center space-x-3"
              }`}
            >
              {/* Main Logo Container */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
                className={`relative rounded-2xl flex items-center justify-center shadow-2xl ${
                  isCollapsed ? "w-10 h-10" : "w-12 h-12"
                } ${
                  darkMode
                    ? "bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700"
                    : "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600"
                } cursor-pointer`}
                onMouseEnter={() => setLogoAnimation(true)}
              >
                {/* Glow Effect - PERBAIKAN DI SINI */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-2xl border-2 border-blue-400/30"
                />

                {/* Rotating Coin Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.div>

                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <DollarSign
                    className={`${
                      isCollapsed ? "w-5 h-5" : "w-6 h-6"
                    } text-white`}
                  />
                </motion.div>

                {/* Sparkles Animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, 10, 0],
                    x: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 1,
                  }}
                  className="absolute -bottom-1 -left-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                </motion.div>
              </motion.div>

              {/* Logo Text with Typing Animation */}
              {!isCollapsed && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: textAnimation ? 1 : 0,
                    x: textAnimation ? 0 : -20,
                  }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="relative">
                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className={`text-lg font-bold tracking-tight truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <span className="relative">
                        {/* Rcane't Text with Gradient Animation */}
                        <motion.span
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className={`bg-gradient-to-r ${
                            darkMode
                              ? "from-blue-400 via-purple-400 to-blue-400"
                              : "from-blue-600 via-purple-600 to-blue-600"
                          } bg-[length:200%_auto] bg-clip-text text-transparent`}
                          style={{ backgroundSize: "200% auto" }}
                        >
                          Rcane'
                        </motion.span>

                        {/* Animated "t" Character */}
                        <motion.span
                          animate={{
                            rotate: [0, 10, -10, 0],
                            color: darkMode
                              ? ["#60a5fa", "#a78bfa", "#60a5fa"]
                              : ["#2563eb", "#7c3aed", "#2563eb"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut",
                          }}
                          className="inline-block"
                        >
                          t
                        </motion.span>

                        {/* Finance Text with Wave Animation */}
                        <motion.span
                          animate={{
                            opacity: [1, 0.8, 1],
                            x: [0, 2, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`ml-1 ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                        Finance
                        </motion.span>
                      </span>
                    </motion.h1>

                    {/* Underline Animation */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: textAnimation ? "100%" : 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                      className={`h-0.5 mt-1 ${
                        darkMode
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gradient-to-r from-blue-400 to-purple-400"
                      }`}
                    />

                    {/* Tagline with Fade In */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center space-x-1 mt-2"
                    >
                      {/* PRO Badge with Pulse */}
                      <motion.span
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${
                          darkMode
                            ? "bg-green-900/30 text-green-400 border border-green-800/50"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Zap className="w-2.5 h-2.5 inline mr-1" />
                        </motion.div>
                        PRO
                      </motion.span>

                      {/* Version with Fade */}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`text-xs ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        v2.1.0
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Collapse Toggle Button - Desktop Only */}
            {!isCollapsed && !isMobile && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCollapse}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </motion.button>
            )}
          </div>

          {/* Animated Line Chart Below Logo */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-4 relative h-12"
            >
              {/* Chart Line */}
              <svg className="w-full h-12" viewBox="0 0 100 40">
                <motion.path
                  d="M0,30 Q20,10 40,20 Q60,30 80,10 Q100,0 100,0"
                  fill="none"
                  stroke={
                    darkMode
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(59, 130, 246, 0.2)"
                  }
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                />

                {/* Animated Points */}
                <motion.circle
                  cx="40"
                  cy="20"
                  r="2"
                  fill={darkMode ? "#60a5fa" : "#2563eb"}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 2.5, duration: 0.5, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="80"
                  cy="10"
                  r="2"
                  fill={darkMode ? "#8b5cf6" : "#7c3aed"}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 3, duration: 0.5, ease: "easeInOut" }}
                />
              </svg>

              {/* Trending Icon */}
              <motion.div
                animate={{
                  x: [0, 80, 0],
                  y: [30, 10, 30],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0"
              >
                <TrendingUpIcon className="w-3 h-3 text-green-500" />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Navigation Label */}
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Navigation
            </motion.p>
          )}

          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const delay = 2 + index * 0.1;

            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 0.3, ease: "easeOut" }}
              >
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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative rounded-xl flex items-center justify-center
                      ${isCollapsed ? "w-9 h-9" : "w-9 h-9"}
                      ${
                        isActive
                          ? `bg-gradient-to-br ${item.gradient} shadow-md`
                          : darkMode
                          ? "bg-gray-800"
                          : "bg-gray-100"
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <motion.div
                        animate={
                          isActive
                            ? {
                                rotate: [0, 360],
                                transition: {
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                },
                              }
                            : {}
                        }
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
                      </motion.div>
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Label */}
                    {!isCollapsed && (
                      <motion.span
                        className={`font-medium ${
                          isActive
                            ? darkMode
                              ? "text-blue-300"
                              : "text-blue-600"
                            : darkMode
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                        whileHover={{ x: 2 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </div>

                  {/* Badge & Arrow */}
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            darkMode
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                      {isActive && (
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ChevronRight
                            className={`w-4 h-4 ${
                              darkMode ? "text-blue-400" : "text-blue-500"
                            }`}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="px-2 py-3 space-y-1">
          {bottomMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const delay = 2.6 + index * 0.1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, ease: "easeOut" }}
              >
                <Link
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
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                      className={`${
                        isCollapsed ? "w-8 h-8" : "w-8 h-8"
                      } rounded-lg flex items-center justify-center ${
                        darkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <item.icon
                        className={`${isCollapsed ? "w-4 h-4" : "w-4 h-4"}`}
                      />
                    </motion.div>
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && item.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        darkMode
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, ease: "easeOut" }}
          className={`p-4 border-t ${
            darkMode ? "border-gray-800/50" : "border-gray-200/50"
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`absolute inset-0 rounded-full border-2 ${
                  darkMode ? "border-blue-500/20" : "border-blue-500/10"
                }`}
              />

              <div
                className={`relative ${
                  isCollapsed ? "w-10 h-10" : "w-12 h-12"
                } rounded-full flex items-center justify-center border-2 ${
                  darkMode ? "border-blue-500/30" : "border-blue-500/20"
                }`}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${
                    darkMode
                      ? "from-blue-700 to-purple-700"
                      : "from-blue-600 to-purple-600"
                  } bg-[length:200%_auto]`}
                  style={{ backgroundSize: "200% auto" }}
                >
                  {user.name?.charAt(0) || "U"}
                </motion.div>
              </div>

              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-1 -right-1"
              >
                <Shield className="w-4 h-4 bg-green-500 text-white p-0.5 rounded-full border-2 border-white dark:border-gray-900" />
              </motion.div>
            </motion.div>

            {/* User Info */}
            {!isCollapsed && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3, ease: "easeOut" }}
              >
                <p
                  className={`font-bold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name || "User"}
                </p>
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`text-sm truncate ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.role || "Premium User"}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Expand Button when collapsed - Desktop Only */}
        {isCollapsed && !isMobile && (
          <motion.div
            className="p-3 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, ease: "easeOut" }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCollapse}
              className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </motion.button>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;

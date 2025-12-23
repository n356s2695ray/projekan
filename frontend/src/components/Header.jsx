import { useState, useRef, useEffect } from "react";
import { Search, Sun, Moon, ChevronDown, Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "./profileDropdown";
import { darkModeManager } from "../utils/darkModeManager";

const Header = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const [searchQuery, setSearchQuery] = useState("");
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const currencyRef = useRef(null);

  // Subscribe to dark mode changes
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: "1.00" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: "0.92" },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      flag: "🇬🇧",
      rate: "0.79",
    },
    {
      code: "IDR",
      name: "Indonesian Rupiah",
      symbol: "Rp",
      flag: "🇮🇩",
      rate: "15,678",
    },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDarkMode = () => {
    darkModeManager.toggleDarkMode();
  };

  return (
    <header className="sticky top-0 z-30">
      {/* Glassmorphism Header - DIPERBAIKI */}
      <div
        className={`relative backdrop-blur-xl border-b shadow-xl transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-950/95 border-gray-800/50"
            : "bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 border-gray-200/50"
        }`}
      >
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Center: Search Bar */}
            <div
              className={`flex-1 ${
                isSearchActive ? "max-w-2xl mx-4" : "mx-4"
              } transition-all duration-300`}
            >
              <div className="relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => setIsSearchActive(false)}
                    placeholder="Search transactions, reports, or settings..."
                    className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-1 text-sm sm:text-base shadow-sm
                      ${
                        darkMode
                          ? "bg-gray-800/60 text-white placeholder-gray-500 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                          : "bg-white/90 text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                      }`}
                  />

                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchQuery("")}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                        darkMode
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  )}

                  {/* Animasi underline saat active */}
                  {isSearchActive && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        darkMode ? "bg-blue-500" : "bg-blue-500"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Currency Selector - Desktop Only */}
              <div className="hidden md:block relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyDropdown(!currencyDropdown)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-sm
                    ${
                      darkMode
                        ? "bg-gray-800/60 border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                        : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                >
                  <span className="text-lg">{selectedCurrency.flag}</span>
                  <span
                    className={`font-medium text-sm ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedCurrency.code}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ml-1 ${
                      currencyDropdown ? "rotate-180" : ""
                    } ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                </button>

                <AnimatePresence>
                  {currencyDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-lg overflow-hidden z-50 ${
                        darkMode
                          ? "bg-gray-900 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-2">
                        <p
                          className={`px-3 py-2 text-xs font-semibold uppercase ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Select Currency
                        </p>
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setSelectedCurrency(currency);
                              setCurrencyDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
                              selectedCurrency.code === currency.code
                                ? darkMode
                                  ? "bg-blue-900/30 text-blue-300"
                                  : "bg-blue-50 text-blue-600"
                                : darkMode
                                ? "hover:bg-gray-800 text-gray-300"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{currency.flag}</span>
                              <div className="text-left">
                                <p className="font-medium text-sm">
                                  {currency.name}
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                >
                                  {currency.code}
                                </p>
                              </div>
                            </div>
                            {selectedCurrency.code === currency.code && (
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  darkMode ? "bg-blue-400" : "bg-blue-500"
                                }`}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={handleToggleDarkMode}
                className={`p-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                )}
              </button>

              {/* Notifications */}
              <button
                className={`relative p-2.5 rounded-lg border transition-colors ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <Bell
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></span>
              </button>

              {/* Profile Dropdown Component */}
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

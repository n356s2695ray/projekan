import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { darkModeManager } from "../utils/darkModeManager";

const Footer = () => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setDarkMode);
    return unsubscribe;
  }, []);

  return (
    <footer
      className={`mt-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
    >
      {/* Gradient Bar */}
      <div
        className={`h-1 w-full ${
          darkMode
            ? "bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900"
            : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300"
        }`}
      ></div>

      {/* Footer Content - Compact */}
      <div
        className={`${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 via-purple-50 to-white"
        } py-6 px-4`}
      >
        <div className="container mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Left: Brand */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? "bg-gradient-to-br from-blue-700 to-purple-700"
                      : "bg-gradient-to-br from-blue-500 to-purple-500"
                  }`}
                >
                  <span className="text-white font-bold text-sm">RF</span>
                </div>
                <div>
                  <h2
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Rcane't<span className="text-blue-500">Finance</span>
                  </h2>
                  <div className="flex items-center space-x-1 text-xs">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        darkMode
                          ? "bg-green-900/30 text-green-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      PRO v2.10
                    </span>
                    <span>© {year}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm">
                Empowering your financial freedom with precision and ease.
              </p>
            </div>

            {/* Center: Links */}
            <div className="flex flex-col md:flex-row md:justify-center gap-8">
              <div>
                <h4
                  className={`font-semibold mb-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Product
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/transactions"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Transactions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analytics"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Analytics
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4
                  className={`font-semibold mb-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Company
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-blue-500 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/careers"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/press"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Legal & Support */}
            <div className="space-y-3">
              <div>
                <h4
                  className={`font-semibold mb-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Legal
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4
                  className={`font-semibold mb-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Support
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    <Link
                      to="/help"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Very Compact */}
          <div
            className={`pt-4 border-t ${
              darkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="text-xs text-center md:text-left">
                <p>Made with ❤️ for better financial management</p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    darkMode ? "bg-gray-800" : "bg-blue-100"
                  }`}
                >
                  ISO 27001 Certified
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    darkMode ? "bg-gray-800" : "bg-purple-100"
                  }`}
                >
                  Bank-Level Security
                </span>
              </div>

              <div className="text-xs">
                <p>© {year} Rcane'tFinance. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

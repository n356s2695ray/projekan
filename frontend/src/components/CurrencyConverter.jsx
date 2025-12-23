import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { darkModeManager } from '../utils/darkModeManager';

const CurrencyConverter = ({ compact = false }) => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  
  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe((newDarkMode) => {
      setDarkMode(newDarkMode);
    });
    return unsubscribe;
  }, []);

  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IDR');
  const [converted, setConverted] = useState(0);
  const [rate, setRate] = useState(15678);
  const [trend, setTrend] = useState('up');

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  ];

  // Exchange rates (simplified)
  const exchangeRates = {
    USD: { IDR: 15678, EUR: 0.92, GBP: 0.79, JPY: 148, SGD: 1.35 },
    EUR: { USD: 1.09, IDR: 17034, GBP: 0.86, JPY: 161, SGD: 1.46 },
    GBP: { USD: 1.27, EUR: 1.16, IDR: 19856, JPY: 187, SGD: 1.70 },
    IDR: { USD: 0.000064, EUR: 0.000059, GBP: 0.000050, JPY: 0.0095, SGD: 0.000086 },
    JPY: { USD: 0.0068, EUR: 0.0062, GBP: 0.0053, IDR: 105, SGD: 0.0091 },
    SGD: { USD: 0.74, EUR: 0.68, GBP: 0.59, IDR: 11628, JPY: 110 },
  };

  useEffect(() => {
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    setRate(rate);
    setConverted(amount * rate);
    // Random trend untuk demo
    setTrend(Math.random() > 0.5 ? 'up' : 'down');
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleRefresh = () => {
    // Simulate refresh rates
    console.log('Refreshing rates...');
  };

  const formatCurrency = (value, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    
    if (currencyCode === 'IDR') {
      return `${symbol} ${value.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;
    }
    return `${symbol} ${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFromCurrencySymbol = () => {
    return currencies.find(c => c.code === fromCurrency)?.symbol || fromCurrency;
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From
            </label>
            <div className={`relative rounded-lg border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 appearance-none bg-transparent text-sm focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code}
                  </option>
                ))}
              </select>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-base">
                {currencies.find(c => c.code === fromCurrency)?.flag}
              </span>
            </div>
          </div>
          
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To
            </label>
            <div className={`relative rounded-lg border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 appearance-none bg-transparent text-sm focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code}
                  </option>
                ))}
              </select>
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-base">
                {currencies.find(c => c.code === toCurrency)?.flag}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount
          </label>
          <div className={`relative rounded-lg border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getFromCurrencySymbol()}
              </span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={`w-full pl-10 pr-3 py-2 bg-transparent text-sm focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Converted Amount
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                title="Swap currencies"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRefresh}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
                title="Refresh rates"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(converted, toCurrency)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              1 {fromCurrency} = {rate.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {toCurrency}
            </div>
            <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend === 'up' ? '+0.24%' : '-0.18%'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Original implementation for larger view
  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Calculator className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Currency Converter</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time exchange rates
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          className={`p-2.5 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
            darkMode 
              ? 'border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white' 
              : 'border-gray-300 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Rates
        </button>
      </div>

      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Currency */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              From Currency
            </label>
            <div className={`relative rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 appearance-none bg-transparent text-base focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.name} ({curr.code})
                  </option>
                ))}
              </select>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                {currencies.find(c => c.code === fromCurrency)?.flag}
              </span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
            </div>
          </div>

          {/* To Currency */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              To Currency
            </label>
            <div className={`relative rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 appearance-none bg-transparent text-base focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.name} ({curr.code})
                  </option>
                ))}
              </select>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                {currencies.find(c => c.code === toCurrency)?.flag}
              </span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount
          </label>
          <div className={`relative rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500' : 'bg-white border-gray-300 focus-within:border-blue-500'}`}>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <span className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getFromCurrencySymbol()}
              </span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={`w-full pl-14 pr-4 py-3 bg-transparent text-lg focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
              min="0"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Convert Button & Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200'}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="text-center md:text-left">
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You Convert
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(amount, fromCurrency)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {fromCurrency}
                </div>
                <ArrowRightLeft className="w-4 h-4 opacity-50" />
                <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                  {toCurrency}
                </div>
              </div>
            </div>

            <button
              onClick={handleSwap}
              className={`p-3 rounded-xl border transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-800 hover:border-gray-600' : 'border-gray-300 hover:bg-white hover:border-gray-400'}`}
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>

            <div className="text-center md:text-right">
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You Receive
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(converted, toCurrency)}
              </div>
              <div className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Exchange rate: 1 {fromCurrency} = {rate.toLocaleString('id-ID', { minimumFractionDigits: 4 })} {toCurrency}
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rate {trend === 'up' ? 'Increased' : 'Decreased'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    {trend === 'up' ? '+0.24% today' : '-0.18% today'}
                  </div>
                </div>
              </div>
              
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Last updated: Today 12:00 UTC
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
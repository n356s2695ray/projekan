import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Tag,
  Wallet as WalletIcon,
  Calendar,
  Loader2,
  CheckCircle,
  Banknote,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Building,
  Smartphone,
  Landmark,
  Coins,
  Briefcase,
  Gift,
  Zap,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Home,
  Heart,
  GraduationCap,
  Plane,
  Plus,
  CreditCard,
  PiggyBank,
  Wallet,
  Search,
  Filter,
  AlertCircle,
  ChevronLeft,
  Clock,
  CalendarDays,
  Target,
  BarChart3,
  Sun,
  Moon,
  MessageSquare,
} from "lucide-react";
import { useFinance } from "../context/FinanceContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  addTransaction as apiAddTransaction,
  updateTransaction as apiUpdateTransaction,
} from "../services/transactionsApi";
import Notification from "./Notification";
import { darkModeManager } from "../utils/darkModeManager";

const AddTransactionForm = ({
  onClose,
  defaultType = "expense",
  editingTransaction = null,
}) => {
  const isEditRef = useRef(false);
  const {
    categories: contextCategories = [],
    categoriesLoading,
    wallets = [],
    afterMutation,
  } = useFinance();

  const isEdit = Boolean(editingTransaction);
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());

  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setDarkMode);
    return unsubscribe;
  }, []);

  const [formData, setFormData] = useState({
    type: defaultType,
    category_id: "",
    wallet_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [step, setStep] = useState(1);
  const [animateOut, setAnimateOut] = useState(false);

  // Animation variants
  const slideIn = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Helper function: Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") return "Rp 0";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  // Helper function: Format compact currency
  const formatCompactCurrency = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "0";
    if (numValue >= 1000000000) return `${(numValue / 1000000000).toFixed(1)}B`;
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(0)}K`;
    return numValue.toString();
  };

  // Helper functions untuk kategori dengan dark mode support
  const getCategoryColor = (name, type) => {
    if (darkMode) {
      const colors = {
        income: {
          Salary: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
          Freelance: "bg-amber-900/30 text-amber-300 border-amber-800/50",
          Investment: "bg-green-900/30 text-green-300 border-green-800/50",
          Bonus: "bg-purple-900/30 text-purple-300 border-purple-800/50",
          Business: "bg-blue-900/30 text-blue-300 border-blue-800/50",
          "Rental Income": "bg-rose-900/30 text-rose-300 border-rose-800/50",
          Interest: "bg-teal-900/30 text-teal-300 border-teal-800/50",
          "Other Income": "bg-gray-800/50 text-gray-300 border-gray-700/50",
          Gaji: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
          Investasi: "bg-green-900/30 text-green-300 border-green-800/50",
          default: "bg-blue-900/30 text-blue-300 border-blue-800/50",
        },
        expense: {
          "Food & Dining":
            "bg-orange-900/30 text-orange-300 border-orange-800/50",
          Transportation: "bg-blue-900/30 text-blue-300 border-blue-800/50",
          Entertainment: "bg-pink-900/30 text-pink-300 border-pink-800/50",
          Shopping: "bg-purple-900/30 text-purple-300 border-purple-800/50",
          "Bills & Utilities":
            "bg-yellow-900/30 text-yellow-300 border-yellow-800/50",
          Healthcare: "bg-rose-900/30 text-rose-300 border-rose-800/50",
          Education: "bg-indigo-900/30 text-indigo-300 border-indigo-800/50",
          Travel: "bg-amber-900/30 text-amber-300 border-amber-800/50",
          "Home & Living": "bg-gray-800/50 text-gray-300 border-gray-700/50",
          "Personal Care": "bg-pink-900/30 text-pink-300 border-pink-800/50",
          Makanan: "bg-orange-900/30 text-orange-300 border-orange-800/50",
          Transportasi: "bg-blue-900/30 text-blue-300 border-blue-800/50",
          Hiburan: "bg-pink-900/30 text-pink-300 border-pink-800/50",
          Belanja: "bg-purple-900/30 text-purple-300 border-purple-800/50",
          Tagihan: "bg-yellow-900/30 text-yellow-300 border-yellow-800/50",
          default: "bg-gray-800/50 text-gray-300 border-gray-700/50",
        },
      };
      return (
        colors[type]?.[name] ||
        colors[type]?.default ||
        "bg-gray-800/50 text-gray-300 border-gray-700/50"
      );
    } else {
      const colors = {
        income: {
          Salary: "bg-emerald-50 text-emerald-700 border-emerald-100",
          Freelance: "bg-amber-50 text-amber-700 border-amber-100",
          Investment: "bg-green-50 text-green-700 border-green-100",
          Bonus: "bg-purple-50 text-purple-700 border-purple-100",
          Business: "bg-blue-50 text-blue-700 border-blue-100",
          "Rental Income": "bg-rose-50 text-rose-700 border-rose-100",
          Interest: "bg-teal-50 text-teal-700 border-teal-100",
          "Other Income": "bg-gray-50 text-gray-700 border-gray-100",
          Gaji: "bg-emerald-50 text-emerald-700 border-emerald-100",
          Investasi: "bg-green-50 text-green-700 border-green-100",
          default: "bg-blue-50 text-blue-700 border-blue-100",
        },
        expense: {
          "Food & Dining": "bg-orange-50 text-orange-700 border-orange-100",
          Transportation: "bg-blue-50 text-blue-700 border-blue-100",
          Entertainment: "bg-pink-50 text-pink-700 border-pink-100",
          Shopping: "bg-purple-50 text-purple-700 border-purple-100",
          "Bills & Utilities": "bg-yellow-50 text-yellow-700 border-yellow-100",
          Healthcare: "bg-rose-50 text-rose-700 border-rose-100",
          Education: "bg-indigo-50 text-indigo-700 border-indigo-100",
          Travel: "bg-amber-50 text-amber-700 border-amber-100",
          "Home & Living": "bg-gray-50 text-gray-700 border-gray-100",
          "Personal Care": "bg-pink-50 text-pink-700 border-pink-100",
          Makanan: "bg-orange-50 text-orange-700 border-orange-100",
          Transportasi: "bg-blue-50 text-blue-700 border-blue-100",
          Hiburan: "bg-pink-50 text-pink-700 border-pink-100",
          Belanja: "bg-purple-50 text-purple-700 border-purple-100",
          Tagihan: "bg-yellow-50 text-yellow-700 border-yellow-100",
          default: "bg-gray-50 text-gray-700 border-gray-100",
        },
      };
      return (
        colors[type]?.[name] ||
        colors[type]?.default ||
        "bg-gray-50 text-gray-700 border-gray-100"
      );
    }
  };

  const getCategoryIcon = (name, type) => {
    const icons = {
      Salary: Briefcase,
      Freelance: Coins,
      Investment: TrendingUp,
      Business: Building,
      "Rental Income": Home,
      Interest: Landmark,
      "Other Income": Coins,
      Gaji: Briefcase,
      Bonus: Gift,
      Investasi: TrendingUp,
      "Food & Dining": Utensils,
      Transportation: Car,
      Entertainment: Gamepad2,
      Shopping: ShoppingBag,
      "Bills & Utilities": Zap,
      Healthcare: Heart,
      Education: GraduationCap,
      Travel: Plane,
      "Home & Living": Home,
      "Personal Care": Heart,
      Makanan: Utensils,
      Transportasi: Car,
      Hiburan: Gamepad2,
      Belanja: ShoppingBag,
      Tagihan: Zap,
      default: type === "income" ? TrendingUp : Tag,
    };
    return icons[name] ?? icons.default ?? Tag;
  };

  const getWalletIcon = (type) => {
    const icons = {
      bank: Landmark,
      ewallet: Smartphone,
      credit: CreditCard,
      savings: PiggyBank,
      cash: Wallet,
      investment: TrendingUp,
      crypto: Coins,
      default: WalletIcon,
    };
    return icons[type] || icons.default;
  };

  const getWalletColor = (type) => {
    if (darkMode) {
      const colors = {
        bank: "bg-blue-900/30 text-blue-300 border-blue-800/50",
        ewallet: "bg-green-900/30 text-green-300 border-green-800/50",
        credit: "bg-rose-900/30 text-rose-300 border-rose-800/50",
        savings: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
        cash: "bg-amber-900/30 text-amber-300 border-amber-800/50",
        investment: "bg-purple-900/30 text-purple-300 border-purple-800/50",
        crypto: "bg-orange-900/30 text-orange-300 border-orange-800/50",
        default: "bg-gray-800/50 text-gray-300 border-gray-700/50",
      };
      return colors[type] || colors.default;
    } else {
      const colors = {
        bank: "bg-blue-50 text-blue-600 border-blue-100",
        ewallet: "bg-green-50 text-green-600 border-green-100",
        credit: "bg-rose-50 text-rose-600 border-rose-100",
        savings: "bg-emerald-50 text-emerald-600 border-emerald-100",
        cash: "bg-amber-50 text-amber-600 border-amber-100",
        investment: "bg-purple-50 text-purple-600 border-purple-100",
        crypto: "bg-orange-50 text-orange-600 border-orange-100",
        default: "bg-gray-50 text-gray-600 border-gray-100",
      };
      return colors[type] || colors.default;
    }
  };

  // Dummy categories
  const dummyCategories = [
    {
      id: 1,
      user_id: 1,
      name: "Gaji",
      type: "income",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 2,
      user_id: 1,
      name: "Bonus",
      type: "income",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 3,
      user_id: 1,
      name: "Investasi",
      type: "income",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 4,
      user_id: 1,
      name: "Makanan",
      type: "expense",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 5,
      user_id: 1,
      name: "Transportasi",
      type: "expense",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 6,
      user_id: 1,
      name: "Hiburan",
      type: "expense",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 7,
      user_id: 1,
      name: "Tagihan",
      type: "expense",
      icon: "wallet",
      color: "#4f46e5",
    },
    {
      id: 8,
      user_id: 1,
      name: "Belanja",
      type: "expense",
      icon: "wallet",
      color: "#4f46e5",
    },
  ];

  const categories = contextCategories.length
    ? contextCategories
    : dummyCategories;
  const displayCategories = categories.map((cat) => ({
    ...cat,
    color: cat.color || "#4f46e5",
    icon: getCategoryIcon(cat.name, cat.type) || Tag,
  }));

  // Enhanced wallets
  const enhancedWallets = useMemo(() => {
    if (wallets && wallets.length > 0) {
      return wallets.map((wallet) => ({
        ...wallet,
        id: Number(wallet.id),
        balance: Number(wallet.balance) || 0,
        icon: getWalletIcon(wallet.type),
        color: getWalletColor(wallet.type),
        type: wallet.type || "default",
      }));
    }
    return [];
  }, [wallets, darkMode]);

  // Set default wallet_id
  useEffect(() => {
    if (enhancedWallets.length > 0 && !formData.wallet_id) {
      setFormData((prev) => ({
        ...prev,
        wallet_id: enhancedWallets[0].id.toString(),
      }));
    }
  }, [enhancedWallets]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return displayCategories
      .filter((c) => c.type === formData.type)
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [displayCategories, formData.type, searchTerm]);

  // Quick amounts dengan dark mode support
  const getLightModeAmountColor = (type) => {
    const colors = {
      small: "bg-gray-50 border-gray-200 hover:bg-gray-100",
      medium: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      high: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      premium: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    };
    return colors[type] || colors.medium;
  };

  const getDarkModeAmountColor = (type) => {
    const colors = {
      small: "bg-gray-800/50 border-gray-700 hover:bg-gray-800",
      medium: "bg-blue-900/30 border-blue-800/50 hover:bg-blue-900/40",
      high: "bg-amber-900/30 border-amber-800/50 hover:bg-amber-900/40",
      premium: "bg-purple-900/30 border-purple-800/50 hover:bg-purple-900/40",
    };
    return colors[type] || colors.medium;
  };

  const quickAmounts = useMemo(() => {
    const baseAmounts =
      formData.type === "income"
        ? [
            { value: 500000, label: "500K", type: "medium" },
            { value: 1000000, label: "1M", type: "high" },
            { value: 2500000, label: "2.5M", type: "high" },
            { value: 5000000, label: "5M", type: "premium" },
            { value: 10000000, label: "10M", type: "premium" },
          ]
        : [
            { value: 10000, label: "10K", type: "small" },
            { value: 50000, label: "50K", type: "medium" },
            { value: 100000, label: "100K", type: "medium" },
            { value: 250000, label: "250K", type: "high" },
            { value: 500000, label: "500K", type: "high" },
          ];

    return baseAmounts.map((amount) => ({
      ...amount,
      formatted: formatCompactCurrency(amount.value),
      color: darkMode
        ? getDarkModeAmountColor(amount.type)
        : getLightModeAmountColor(amount.type),
    }));
  }, [formData.type, darkMode]);

  // Get selected items
  const selectedCategory = useMemo(
    () => displayCategories.find((c) => c.id === Number(formData.category_id)),
    [displayCategories, formData.category_id]
  );

  const selectedWallet = useMemo(
    () => enhancedWallets.find((w) => w.id === Number(formData.wallet_id)),
    [enhancedWallets, formData.wallet_id]
  );

  // Effects
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => {
      document.body.classList.remove("overflow-hidden");
      clearTimeout(timer);
    };
  }, []);

useEffect(() => {
  if (editingTransaction) {
    isEditRef.current = true; // 👈 PENTING
    setFormData({
      type: editingTransaction.type,
      category_id: editingTransaction.category_id.toString(),
      wallet_id: editingTransaction.wallet_id.toString(),
      amount: editingTransaction.amount.toString(),
      description: editingTransaction.description || "",
      date: new Date(editingTransaction.date).toISOString().slice(0, 10),
    });
    setStep(6);
  }
}, [editingTransaction]);

  // Set default category_id
  useEffect(() => {
    const availableCategories = displayCategories.filter(
      (c) => c.type === formData.type
    );
    const categoryIdNum = Number(formData.category_id);

    if (
      availableCategories.length > 0 &&
      (!formData.category_id ||
        !availableCategories.some((c) => c.id === categoryIdNum))
    ) {
      setFormData((prev) => ({
        ...prev,
        category_id: availableCategories[0].id.toString(),
      }));
    }
  }, [formData.type, displayCategories, formData.category_id]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Masukkan jumlah yang valid (lebih dari 0)";
    } else if (Number(formData.amount) > 1000000000) {
      newErrors.amount = "Jumlah tidak boleh melebihi 1 miliar";
    }
    if (!formData.category_id) {
      newErrors.category = "Pilih kategori";
    }
    if (!formData.wallet_id) {
      newErrors.wallet = "Pilih dompet";
    }
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      newErrors.date = "Tanggal tidak boleh di masa depan";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle amount change
  const handleAmountChange = (value) => {
    const cleanedValue = String(value).replace(/[^\d.]/g, "");
    const parts = cleanedValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    if (cleanedValue && parseFloat(cleanedValue) > 1000000000) return;
    setFormData((prev) => ({ ...prev, amount: cleanedValue }));
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };

  // Handle description change
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Handle submit - DIPERBAIKI
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      console.log("❌ Validasi gagal");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = displayCategories.find(
        (c) => c.id === Number(formData.category_id)
      );
      if (!selectedCategory) {
        showNotification("Kategori belum siap. Coba tunggu sebentar.", "error");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        type: formData.type,
        amount: Number(formData.amount),
        category_id: Number(formData.category_id),
        wallet_id: Number(formData.wallet_id),
        description: formData.description?.trim() || null,
        trx_date: formData.date,
      };

      console.log("📤 Payload yang dikirim:", payload);

      let response;
      if (isEditRef.current) {
        response = await apiUpdateTransaction(editingTransaction.id, payload);
      } else {
        response = await apiAddTransaction(payload);
      }


      // Pastikan afterMutation() dipanggil dan menunggu selesai
      console.log("🔄 Memanggil afterMutation...");
      if (afterMutation) {
        await afterMutation();
        console.log("✅ afterMutation selesai");
      } else {
        console.log("⚠️ afterMutation tidak ada");
      }

      setSuccess(true);

      // Auto close setelah 2 detik
      setTimeout(() => {
        setAnimateOut(true);
        setTimeout(() => {
          console.log("🔴 Menutup modal...");
          onClose();
        }, 300);
      }, 2000);
    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err);
      console.error(
        "❌ Error details:",
        err.response?.data || err.message || err
      );
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan transaksi";
      showNotification(errorMessage, "error");
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 backdrop-blur-xl ${
            darkMode ? "bg-gray-900/95" : "bg-gray-900/80"
          }`}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative rounded-3xl shadow-2xl w-full max-w-md p-12 text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2
              className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
          </motion.div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Mempersiapkan Form
          </h3>
          <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Mohon tunggu sebentar...
          </p>
        </motion.div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 backdrop-blur-xl ${
            darkMode ? "bg-gray-900/95" : "bg-gray-900/80"
          }`}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative rounded-3xl shadow-2xl w-full max-w-md p-8 text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="mb-8"
          >
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-14 h-14 text-white" />
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Transaksi Berhasil!
            </h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {formData.type === "income" ? "Pemasukan" : "Pengeluaran"} telah
              dicatat
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-6 mb-8"
          >
            <motion.div
              variants={fadeIn}
              className={`p-5 rounded-2xl border-2 ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gradient-to-r from-white to-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    formData.type === "income"
                      ? "bg-emerald-100"
                      : "bg-rose-100"
                  }`}
                >
                  {formData.type === "income" ? (
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-rose-600" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formData.type === "income"
                      ? "Pemasukan Ditambahkan"
                      : "Pengeluaran Dicatat"}
                  </span>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      formData.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {formData.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(formData.amount)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Menutup otomatis...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main form
  return (
    <>
      {/* Notification untuk transaksi sukses/gagal */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[9999]"
          >
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 backdrop-blur-xl ${
            darkMode ? "bg-gray-900/95" : "bg-gray-900/80"
          }`}
          onClick={onClose}
        />

        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={
            animateOut ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }
          }
          transition={{ type: "spring", damping: 25 }}
          className={`relative rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div
            className={`p-6 border-b shrink-0 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                >
                  <Banknote className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isEdit ? "Edit Transaksi" : "Transaksi Baru"}
                  </h2>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Langkah {step} dari 6
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => darkModeManager.toggleDarkMode()}
                  className={`p-2 rounded-xl ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className={`p-2 rounded-xl ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X
                    className={`w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </motion.button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        step >= s
                          ? "bg-indigo-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s}
                    </div>
                    <span
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {s === 1
                        ? "Tipe"
                        : s === 2
                        ? "Jumlah"
                        : s === 3
                        ? "Kategori"
                        : s === 4
                        ? "Dompet"
                        : s === 5
                        ? "Deskripsi"
                        : "Konfirmasi"}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / 6) * 100}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6"
            style={{ maxHeight: "calc(90vh - 300px)" }}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Pilih Jenis Transaksi
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, type: "income" }));
                        setSearchTerm("");
                        nextStep();
                      }}
                      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.type === "income"
                          ? "border-emerald-500 bg-gradient-to-b from-emerald-50 to-white shadow-lg"
                          : darkMode
                          ? "border-gray-700 hover:border-emerald-500 hover:bg-gray-800"
                          : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                      }`}
                    >
                      <motion.div
                        animate={
                          formData.type === "income" ? { rotate: 360 } : {}
                        }
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-xl mb-4 ${
                          formData.type === "income"
                            ? "bg-emerald-100"
                            : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <ArrowUpCircle
                          className={`w-8 h-8 ${
                            formData.type === "income"
                              ? "text-emerald-600"
                              : darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Pemasukan
                      </span>
                      <span
                        className={`text-sm mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Uang masuk
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, type: "expense" }));
                        setSearchTerm("");
                        nextStep();
                      }}
                      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.type === "expense"
                          ? "border-rose-500 bg-gradient-to-b from-rose-50 to-white shadow-lg"
                          : darkMode
                          ? "border-gray-700 hover:border-rose-500 hover:bg-gray-800"
                          : "border-gray-200 hover:border-rose-300 hover:shadow-md"
                      }`}
                    >
                      <motion.div
                        animate={
                          formData.type === "expense" ? { rotate: 360 } : {}
                        }
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-xl mb-4 ${
                          formData.type === "expense"
                            ? "bg-rose-100"
                            : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <ArrowDownCircle
                          className={`w-8 h-8 ${
                            formData.type === "expense"
                              ? "text-rose-600"
                              : darkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Pengeluaran
                      </span>
                      <span
                        className={`text-sm mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Uang keluar
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Masukkan Jumlah
                    </h3>
                    <button
                      onClick={prevStep}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          darkMode
                            ? "bg-gray-700"
                            : "bg-gradient-to-br from-gray-100 to-gray-50"
                        }`}
                      >
                        <Banknote
                          className={`w-6 h-6 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        />
                      </div>
                    </div>
                    <motion.input
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      className={`w-full pl-20 pr-24 py-5 border-2 rounded-xl text-4xl font-bold focus:outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500/20"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span
                        className={`text-lg font-bold ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        IDR
                      </span>
                    </div>
                  </div>

                  {formData.amount && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl border-2 ${
                        formData.type === "income"
                          ? darkMode
                            ? "border-emerald-800/50 bg-emerald-900/20"
                            : "border-emerald-200 bg-emerald-50"
                          : darkMode
                          ? "border-rose-800/50 bg-rose-900/20"
                          : "border-rose-200 bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Total
                          </span>
                          <p
                            className={`text-2xl font-bold ${
                              formData.type === "income"
                                ? "text-emerald-500"
                                : "text-rose-500"
                            }`}
                          >
                            {formatCurrency(formData.amount)}
                          </p>
                        </div>
                        <Target
                          className={`w-8 h-8 ${
                            formData.type === "income"
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {quickAmounts.map(
                      ({ value, label, color, formatted }, index) => (
                        <motion.button
                          key={value}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            handleAmountChange(value.toString());
                            setTimeout(nextStep, 300);
                          }}
                          className={`p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-md text-center ${color}`}
                        >
                          <div
                            className={`font-bold text-lg ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {label}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatted}
                          </div>
                        </motion.button>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Pilih Kategori
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formData.type === "income"
                          ? "Pemasukan"
                          : "Pengeluaran"}
                      </p>
                    </div>
                    <button
                      onClick={prevStep}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="relative">
                    <Search
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Cari kategori..."
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500"
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border-2 rounded-xl ${
                        darkMode
                          ? "border-indigo-800/50 bg-indigo-900/20"
                          : "border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg shadow-sm ${getCategoryColor(
                              selectedCategory.name,
                              selectedCategory.type
                            )}`}
                          >
                            {React.createElement(
                              getCategoryIcon(
                                selectedCategory.name,
                                selectedCategory.type
                              ),
                              { className: "w-6 h-6" }
                            )}
                          </div>
                          <div>
                            <div
                              className={`font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {selectedCategory.name}
                            </div>
                            <div
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              Dipilih
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={staggerChildren}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1"
                  >
                    {filteredCategories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        variants={fadeIn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            category_id: category.id.toString(),
                          });
                          setTimeout(nextStep, 300);
                        }}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                          Number(formData.category_id) === category.id
                            ? darkMode
                              ? "border-indigo-500 bg-indigo-900/30 shadow-lg"
                              : "border-indigo-500 bg-indigo-50 shadow-lg"
                            : darkMode
                            ? "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700 hover:shadow-md"
                            : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg mb-2 shadow-sm ${getCategoryColor(
                            category.name,
                            category.type
                          )}`}
                        >
                          {React.createElement(
                            getCategoryIcon(category.name, category.type),
                            { className: "w-5 h-5" }
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold text-center truncate w-full ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {category.name}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Pilih Dompet
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Saldo akan diperbarui
                      </p>
                    </div>
                    <button
                      onClick={prevStep}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  {selectedWallet && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 border-2 rounded-xl shadow-sm ${
                        darkMode
                          ? "border-indigo-800/50 bg-indigo-900/20"
                          : "border-indigo-200 bg-gradient-to-r from-indigo-50/80 to-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg shadow-sm ${selectedWallet.color}`}
                          >
                            {React.createElement(
                              getWalletIcon(selectedWallet.type),
                              { className: "w-6 h-6" }
                            )}
                          </div>
                          <div>
                            <div
                              className={`font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {selectedWallet.name}
                            </div>
                            <div
                              className={`text-lg font-bold mt-1 ${
                                selectedWallet.balance >= 0
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {formatCurrency(selectedWallet.balance)}
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={staggerChildren}
                    className="space-y-3 p-1"
                  >
                    {enhancedWallets.map((wallet, index) => {
                      const WalletIconComponent = getWalletIcon(wallet.type);
                      return (
                        <motion.button
                          key={wallet.id}
                          variants={fadeIn}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              wallet_id: wallet.id.toString(),
                            });
                            setTimeout(nextStep, 300);
                          }}
                          className={`w-full p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-md ${
                            Number(formData.wallet_id) === wallet.id
                              ? darkMode
                                ? "border-indigo-500 bg-indigo-900/30"
                                : "border-indigo-500 bg-indigo-50"
                              : darkMode
                              ? "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-lg shadow-sm ${wallet.color}`}
                              >
                                <WalletIconComponent className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div
                                  className={`font-semibold ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {wallet.name}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span
                                    className={`text-sm font-medium ${
                                      wallet.balance >= 0
                                        ? "text-emerald-500"
                                        : "text-rose-500"
                                    }`}
                                  >
                                    {formatCurrency(wallet.balance)}
                                  </span>
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      darkMode
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {wallet.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Tambahkan Deskripsi
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Opsional, tapi disarankan
                      </p>
                    </div>
                    <button
                      onClick={prevStep}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <MessageSquare
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <textarea
                        placeholder="Contoh: Makan siang di resto, gaji bulan januari, beli baju baru..."
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none min-h-[120px] ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500"
                        }`}
                        value={formData.description}
                        onChange={(e) =>
                          handleDescriptionChange(e.target.value)
                        }
                        maxLength={200}
                      />
                      <div
                        className={`text-xs mt-2 text-right ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formData.description.length}/200 karakter
                      </div>
                    </div>

                    {/* Quick description suggestions */}
                    <div className="grid grid-cols-2 gap-3">
                      {formData.type === "income" ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Gaji bulanan")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Gaji bulanan
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Pemasukan rutin
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Bonus tahunan")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Bonus tahunan
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Tambahan insentif
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Hasil investasi")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Hasil investasi
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Return portfolio
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Freelance project")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Freelance project
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Pekerjaan sampingan
                            </div>
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Makan siang")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Makan siang
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Kebutuhan harian
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Transportasi harian")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Transportasi
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Bensin/transport
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Belanja bulanan")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Belanja bulanan
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Kebutuhan rumah
                            </div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() =>
                              handleDescriptionChange("Tagihan listrik")
                            }
                            className={`p-3 border-2 rounded-xl text-left ${
                              darkMode
                                ? "border-gray-700 hover:border-indigo-500 bg-gray-800"
                                : "border-gray-200 hover:border-indigo-300 bg-gray-50"
                            }`}
                          >
                            <div
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Tagihan listrik
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Pembayaran rutin
                            </div>
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div
                  key="step6"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 pb-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Konfirmasi Transaksi
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Periksa detail sebelum menyimpan
                      </p>
                    </div>
                    <button
                      onClick={prevStep}
                      className={`p-2 rounded-lg ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft
                        className={`w-5 h-5 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                  </div>

                  <motion.div variants={staggerChildren} className="space-y-4">
                    {/* Amount Card */}
                    <motion.div
                      variants={fadeIn}
                      className={`p-5 rounded-2xl border-2 ${
                        formData.type === "income"
                          ? darkMode
                            ? "border-emerald-800/50 bg-emerald-900/20"
                            : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-50/70"
                          : darkMode
                          ? "border-rose-800/50 bg-rose-900/20"
                          : "border-rose-200 bg-gradient-to-r from-rose-50 to-rose-50/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-4 rounded-xl ${
                            formData.type === "income"
                              ? "bg-emerald-100"
                              : "bg-rose-100"
                          }`}
                        >
                          {formData.type === "income" ? (
                            <TrendingUp className="w-8 h-8 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-8 h-8 text-rose-600" />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {formData.type === "income"
                              ? "Jumlah Pemasukan"
                              : "Jumlah Pengeluaran"}
                          </span>
                          <p
                            className={`text-2xl font-bold mt-1 ${
                              formData.type === "income"
                                ? "text-emerald-500"
                                : "text-rose-500"
                            }`}
                          >
                            {formatCurrency(formData.amount)}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <motion.div
                        variants={fadeIn}
                        className={`p-4 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-200 bg-white"
                        } shadow-sm`}
                      >
                        <span
                          className={`text-xs font-medium uppercase ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Kategori
                        </span>
                        <div className="flex items-center gap-3 mt-2">
                          {selectedCategory && (
                            <>
                              <div
                                className={`p-2 rounded-lg ${getCategoryColor(
                                  selectedCategory.name,
                                  selectedCategory.type
                                )}`}
                              >
                                {React.createElement(
                                  getCategoryIcon(
                                    selectedCategory.name,
                                    selectedCategory.type
                                  ),
                                  { className: "w-4 h-4" }
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-sm ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {selectedCategory.name}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>

                      {/* Wallet */}
                      <motion.div
                        variants={fadeIn}
                        className={`p-4 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-200 bg-white"
                        } shadow-sm`}
                      >
                        <span
                          className={`text-xs font-medium uppercase ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Dompet
                        </span>
                        <div className="flex items-center gap-3 mt-2">
                          {selectedWallet && (
                            <>
                              <div
                                className={`p-2 rounded-lg ${selectedWallet.color}`}
                              >
                                {React.createElement(
                                  getWalletIcon(selectedWallet.type),
                                  { className: "w-4 h-4" }
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-sm ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {selectedWallet.name}
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {formatCurrency(selectedWallet.balance)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Description */}
                    {formData.description && (
                      <motion.div
                        variants={fadeIn}
                        className={`p-4 rounded-xl border ${
                          darkMode
                            ? "border-gray-700 bg-gray-800"
                            : "border-gray-200 bg-white"
                        } shadow-sm`}
                      >
                        <span
                          className={`text-xs font-medium uppercase ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Deskripsi
                        </span>
                        <p
                          className={`font-medium mt-2 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {formData.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Date */}
                    <motion.div
                      variants={fadeIn}
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? "border-gray-700 bg-gray-800/50"
                          : "border-gray-200 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays
                          className={`w-5 h-5 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <div>
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Tanggal Transaksi
                          </span>
                          <p
                            className={`font-medium mt-1 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(formData.date).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer - Fixed di bagian bawah */}
          <div
            className={`p-6 border-t shrink-0 ${
              darkMode
                ? "border-gray-700 bg-gray-900/50"
                : "border-gray-200 bg-gradient-to-t from-white via-white to-white/95"
            }`}
          >
            <AnimatePresence mode="wait">
              {step < 6 ? (
                <motion.div
                  key="navigation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`flex-1 py-4 px-4 border-2 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Kembali
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={
                      (step === 2 && !formData.amount) ||
                      (step === 3 && !formData.category_id) ||
                      (step === 4 && !formData.wallet_id)
                    }
                    className="flex-1 py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 5 ? "Konfirmasi" : "Lanjut"}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-5 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                          {formData.type === "income" ? (
                            <Plus className="w-5 h-5" />
                          ) : (
                            <TrendingDown className="w-5 h-5" />
                          )}
                        </div>
                        <span>Simpan Transaksi</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p
                    className={`text-xs text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Transaksi akan langsung dicatat dan tercermin di analitik
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddTransactionForm;

import { useState, useEffect } from "react";
import { registerUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  TrendingUp,
  DollarSign,
  DollarSignIcon,
  PieChart,
  BarChart3,
  Smartphone,
  CheckCircle,
  Globe,
  Zap,
  Sparkles,
  Shield,
  Users,
  Clock,
  Target,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <CreditCard className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Multi-Currency Wallets",
      desc: "Manage 50+ global currencies with real-time exchange rates",
    },
    {
      icon: <PieChart className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Real-Time Analytics",
      desc: "Advanced financial analytics with AI-powered insights",
    },
    {
      icon: <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Smart Investing",
      desc: "Algorithmic trading and portfolio optimization tools",
    },
    {
      icon: <Globe className="w-8 h-8 md:w-10 md:h-10" />,
      title: "Global Access",
      desc: "Trade and invest across 150+ international markets",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password)
      return {
        strength: 0,
        color: "bg-gradient-to-r from-slate-500 to-slate-600",
        label: "Empty",
      };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    let color = "";
    let label = "";
    if (strength <= 25) {
      color = "bg-gradient-to-r from-red-500 to-orange-500";
      label = "Weak";
    } else if (strength <= 50) {
      color = "bg-gradient-to-r from-orange-500 to-yellow-500";
      label = "Fair";
    } else if (strength <= 75) {
      color = "bg-gradient-to-r from-yellow-500 to-emerald-500";
      label = "Good";
    } else {
      color = "bg-gradient-to-r from-emerald-500 to-cyan-500";
      label = "Strong";
    }

    return { strength, color, label };
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/80 to-cyan-950/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            animate={{
              y: [0, -window.innerHeight],
              x: [0, Math.sin(i) * 100],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: "100%",
            }}
          />
        ))}
      </div>

      {/* Floating Finance Icons */}
      <motion.div
        className="absolute top-20 left-5 md:left-10 lg:left-20 hidden md:block"
        animate={{
          y: [0, -40, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <DollarSign className="w-8 h-8 md:w-12 md:h-12 text-emerald-400/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-5 md:right-10 lg:right-20 hidden md:block"
        animate={{
          y: [0, 40, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <BarChart3 className="w-8 h-8 md:w-12 md:h-12 text-cyan-400/20" />
      </motion.div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30 relative"
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <DollarSignIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-2xl blur-lg"></div>
          </motion.div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Rcane'tFinance
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-1 text-sm text-cyan-400">
              <Users className="w-4 h-4" />
              <span>10,000+ Clients</span>
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center gap-1 text-sm text-emerald-400">
              <Clock className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-base">
            Enterprise-Grade Financial Platform
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Panel - Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl border border-emerald-500/20 p-6 md:p-8 h-full overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
              </div>

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Why Join{" "}
                  <span className="text-emerald-400">Rcane'tFinance</span>?
                </h2>

                {/* Feature Carousel */}
                <div className="relative h-64 md:h-72 mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeature}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-6"
                      >
                        {features[currentFeature].icon}
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {features[currentFeature].title}
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base">
                        {features[currentFeature].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Feature Indicators */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
                    {features.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentFeature(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentFeature
                            ? "w-8 bg-gradient-to-r from-emerald-500 to-cyan-500"
                            : "w-2 bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      value: "99.9%",
                      label: "Uptime",
                      icon: <Target className="w-4 h-4" />,
                    },
                    {
                      value: "256-bit",
                      label: "Encryption",
                      icon: <Shield className="w-4 h-4" />,
                    },
                    {
                      value: "24/7",
                      label: "Support",
                      icon: <Clock className="w-4 h-4" />,
                    },
                    {
                      value: "$1B+",
                      label: "Secured",
                      icon: <DollarSign className="w-4 h-4" />,
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-emerald-400">{stat.icon}</div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-emerald-500/10"
                >
                  <div className="absolute -left-2 -top-2 text-3xl text-emerald-400/30">
                    "
                  </div>
                  <p className="text-slate-300 italic text-sm md:text-base pl-6">
                    Rcane'tFinance transformed our treasury management with its
                    sophisticated tools and enterprise-grade security.
                  </p>
                  <div className="flex items-center gap-3 mt-4 pl-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-white font-bold">i</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        ican.
                      </div>
                      <div className="text-xs text-slate-400">
                        CEO, Rcane'tFinance.
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Glow Effects */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

              <div className="relative">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Create Enterprise Account
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                      Secure access to global financial tools
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                  </motion.div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Registration Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  {/* Name Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                        Required
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="Enter your full name"
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Business Email
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="name@company.com"
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                      {form.email.includes("@") && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          passwordStrength.label === "Strong"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : passwordStrength.label === "Good"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : passwordStrength.label === "Fair"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-12 pr-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="Create strong password"
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* Password Strength Meter */}
                    <AnimatePresence>
                      {form.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${passwordStrength.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${passwordStrength.strength}%`,
                              }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Strength: {passwordStrength.strength}%</span>
                            <span className="flex items-center gap-1">
                              {passwordStrength.strength >= 75 && (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                  <span>Excellent</span>
                                </>
                              )}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-12 pr-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="Re-enter password"
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                      <motion.button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {form.confirmPassword &&
                        form.password !== form.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-400 flex items-center gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            Passwords do not match
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <div className="relative mt-1">
                      <input
                        type="checkbox"
                        required
                        className="w-4 h-4 rounded bg-white/5 border-emerald-500/30 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 opacity-0 absolute"
                      />
                      <motion.div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          form.email && form.password
                            ? "border-emerald-500 bg-emerald-500/20"
                            : "border-slate-600"
                        }`}
                        animate={{
                          scale: form.email && form.password ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {form.email && form.password && (
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        )}
                      </motion.div>
                    </div>
                    <span className="text-sm text-slate-300">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-emerald-300 hover:text-emerald-200 font-semibold"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-emerald-300 hover:text-emerald-200 font-semibold"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full relative z-10"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span className="relative z-10">
                          Securing Account...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">
                          Create Enterprise Account
                        </span>
                        <motion.div
                          className="relative z-10"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Login Link */}
                <div className="mt-6 md:mt-8 pt-6 border-t border-emerald-500/10">
                  <p className="text-center text-slate-400 text-sm md:text-base">
                    Already have an enterprise account?{" "}
                    <Link
                      to="/login"
                      className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      Access Dashboard
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </p>
                </div>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-3"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-slate-300">
                    Protected by bank-grade 256-bit encryption • FDIC Insured
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
              {[
                {
                  value: "256-bit",
                  label: "Encryption",
                  color: "from-emerald-500 to-cyan-500",
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  color: "from-emerald-500 to-cyan-500",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-xl p-3 text-center"
                >
                  <div
                    className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 md:mt-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
            <span className="text-xs text-slate-500">
              © 2024 Rcane'tFinance Inc.
            </span>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <span className="text-xs text-emerald-400">FDIC Insured</span>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <span className="text-xs text-cyan-400">ISO 27001 Certified</span>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <span className="text-xs text-slate-500">
              Licensed in 50+ countries
            </span>
          </div>
          <p className="text-slate-600 text-xs">
            Rcane'tFinance is a registered trademark. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

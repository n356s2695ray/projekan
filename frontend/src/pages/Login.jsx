import { useState, useEffect } from "react";
import { loginUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  LogIn, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  PieChart,
  BarChart3,
  DollarSignIcon,
  Smartphone
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Finance Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Currency Symbols */}
        {["$", "€", "£", "¥", "₹"].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl text-emerald-400/20 font-bold"
            animate={{
              y: [0, -window.innerHeight],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            style={{
              left: `${10 + i * 20}%`,
              top: "100%",
            }}
          >
            {symbol}
          </motion.div>
        ))}

        {/* Animated Graph Lines */}
        <motion.div
          className="absolute top-1/4 left-10 w-20 h-20 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-xl"
          animate={{
            pathLength: [0, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-10 w-24 h-16 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl"
          animate={{
            pathLength: [0, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />

        {/* Floating Finance Icons */}
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <CreditCard className="w-8 h-8 text-emerald-400/20" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -5, 0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <PieChart className="w-8 h-8 text-cyan-400/20" />
        </motion.div>
      </div>

      {/* Mobile Device Frame for Demo */}
      <motion.div
        className="absolute hidden lg:block top-10 right-10 w-64 h-96 bg-slate-900/30 backdrop-blur-sm rounded-3xl border border-emerald-500/20 p-4 shadow-2xl"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-emerald-300">Secure</span>
          </div>
          <Smartphone className="w-5 h-5 text-slate-400" />
        </div>
        <div className="space-y-3">
          <div className="h-2 bg-emerald-900/50 rounded-full"></div>
          <div className="h-2 bg-emerald-900/50 rounded-full w-3/4"></div>
          <div className="h-2 bg-emerald-900/50 rounded-full w-1/2"></div>
          <div className="h-16 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl mt-4"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl p-6 md:p-8 relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

          {/* Logo Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 md:mb-6 shadow-lg shadow-emerald-500/30 relative">
              <DollarSignIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              <motion.div
                className="absolute -inset-1 bg-emerald-500/30 rounded-2xl blur-md"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Rcane'tFinance
            </h1>
            <p className="text-slate-300 mt-2 text-sm md:text-base">Secure access to your financial dashboard</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                  placeholder="enterprise@quantumfinance.com"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/5 border border-emerald-500/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                  placeholder="••••••••"
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
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/5 border-emerald-500/30 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm text-slate-300">Remember device</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Forgot password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Secure Sign In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/90 text-slate-400">
                Enterprise SSO
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-emerald-500/10 rounded-xl text-slate-300 hover:bg-emerald-500/10 transition-colors group"
            >
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-sm">Corporate SSO</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-cyan-500/10 rounded-xl text-slate-300 hover:bg-cyan-500/10 transition-colors group"
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-sm">Investor Portal</span>
            </motion.button>
          </div>

          <div className="mt-6 md:mt-8 p-4 bg-slate-900/50 rounded-xl border border-emerald-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Security Level</p>
                  <p className="text-sm text-emerald-300">Bank-grade Encryption</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-4 bg-emerald-500 rounded-full"
                    animate={{
                      height: ["16px", "24px", "16px"],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-400 mt-6 md:mt-8 text-sm">
            New to Rcane'tFinance?{" "}
            <Link
              to="/register"
              className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Request Access
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-xs mt-4 md:mt-6"
        >
          © 2024 Rcane'tFinance Inc. • FDIC Insured • 
          <span className="text-emerald-400 ml-1">ISO 27001 Certified</span>
        </motion.p>

        {/* Mobile Optimized Features */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 md:hidden">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span>2FA Ready</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
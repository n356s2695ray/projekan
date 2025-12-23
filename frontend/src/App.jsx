// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { FinanceProvider } from "./context/FinanceContext";
import PrivateRoute from "./routes/privateRoute";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QuickAddButton from "./components/QuickAddButton";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import Wallets from "./pages/Wallets";
import Reminders from "./pages/Reminders";
import Investments from "./pages/Investments";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import { NotificationProvider } from "./components/Notification";

import "./styles/global.css";

/* ================= APP LAYOUT ================= */
const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <NotificationProvider>
      <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
        <Sidebar darkMode={darkMode} />

      <main className="ml-20 lg:ml-64 flex-1">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>

      {/* ✅ FOOTER DI SINI */}
      <Footer />
      <QuickAddButton />
      </div>
    </NotificationProvider>
  );
};

/* ================= ROOT APP ================= */
function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;

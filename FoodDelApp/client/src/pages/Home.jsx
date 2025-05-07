import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setUser(profileRes.data);
        setOrdersCount(ordersRes.data.length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-300 border-t-blue-100 rounded-full"
          />
          <p className="text-blue-100 text-xl font-medium">Preparing your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-blue-400/20"
        >
          {/* Header */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
              backgroundSize: ['400% 400%']
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-10 py-8 text-center relative overflow-hidden"
            style={{ backgroundSize: '400% 400%' }}
          >
            <div className="relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white"
              >
                Welcome{user ? `, ${user.username}` : ""}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 mt-2"
              >
                Your culinary journey starts here
              </motion.p>
            </div>
          </motion.div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-400/30 flex items-center space-x-3"
              >
                <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="text-red-100 font-medium">{error}</span>
              </motion.div>
            )}

            {/* Navigation Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/foods"
                  className="group relative block bg-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-white">🍔</span>
                    <span className="font-semibold text-blue-100">Browse Foods</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500/30 px-2 py-1 rounded-full text-xs text-blue-100">
                    New Arrivals
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/cart"
                  className="group relative block bg-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-white">🛒</span>
                    <span className="font-semibold text-blue-100">Your Cart</span>
                    <div className="absolute top-2 right-2 bg-blue-500/30 px-2.5 py-1 rounded-full text-sm text-white">
                      {cart.length}
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/orders"
                  className="group relative block bg-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-white">📦</span>
                    <span className="font-semibold text-blue-100">Order History</span>
                    <div className="absolute top-2 right-2 bg-blue-500/30 px-2.5 py-1 rounded-full text-sm text-white">
                      {ordersCount}
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/profile"
                  className="group relative block bg-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-white">👤</span>
                    <span className="font-semibold text-blue-100">Profile</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-end mb-8"
            >
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-red-500/90 to-orange-500/90 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Logout
              </motion.button>
            </motion.div>

            {/* JWT Token Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-100">Your Session Token</h2>
                <motion.button
                  onClick={copyToken}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              <code className="block p-4 bg-blue-900/30 rounded-lg break-words text-sm font-mono text-blue-100">
                {token}
              </code>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
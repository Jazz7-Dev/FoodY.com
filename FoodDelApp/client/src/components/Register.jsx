import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setSuccess(res.data.message || "User registered successfully");
      setForm({ username: "", password: "" });
      toast.success("Cosmic account created successfully!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <ToastContainer position="bottom-right" theme="dark" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-blue-400/20"
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
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-3 bg-blue-500/30 rounded-xl backdrop-blur-sm border border-blue-400/20"
              >
                <svg 
                  className="w-10 h-10 text-white"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white"
              >
                Join FDA
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 font-medium"
              >
                Start your fooding with us...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Messages */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                key={error ? 'error' : 'success'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`mb-8 p-4 backdrop-blur-sm rounded-xl border ${
                  error ? 'bg-red-500/10 border-red-400/30' : 'bg-emerald-500/10 border-emerald-400/30'
                } flex items-center space-x-3`}
              >
                <svg className={`w-6 h-6 ${error ? 'text-red-300' : 'text-emerald-300'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {error ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className={`font-medium ${error ? 'text-red-100' : 'text-emerald-100'}`}>
                  {error || success}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-blue-100 mb-2">
                  Username
                </label>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300" />
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="@..."
                      value={form.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-900/10 backdrop-blur-sm border border-blue-400/20 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all placeholder-blue-400/50 text-white disabled:bg-blue-900/20 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-3.5 text-blue-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-blue-100 mb-2">
                  Password
                </label>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300" />
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-900/10 backdrop-blur-sm border border-blue-400/20 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all placeholder-blue-400/50 text-white disabled:bg-blue-900/20 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-3.5 text-blue-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Register Now"
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-blue-400/20"
          >
            <p className="text-center text-sm text-blue-200">
              Already part of the community?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-300 hover:text-white transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
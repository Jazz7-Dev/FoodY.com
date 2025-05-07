import { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart({ token }) {
  const { 
    cart, 
    clearCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useContext(CartContext);
  
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      removeFromCart(itemId);
      toast.success("Item removed from cart");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, Math.min(99, newQuantity));
    updateQuantity(itemId, quantity);
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success("Cart cleared successfully");
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a valid delivery address");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const orderPayload = {
        items: cart.map(item => ({
          foodId: item.id ? item.id.toString() : null,
          quantity: Number(item.quantity)
        })),
        totalAmount: parseFloat(getCartTotal().toFixed(2)),
        address: address.trim()
      };

      await axios.post(
        "http://localhost:5000/api/orders",
        orderPayload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      toast.success("Order placed successfully!");
      clearCart();
      setAddress("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        "Failed to place order. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="bottom-right" theme="dark" />
      
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
                Your Culinary Basket
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-2 mt-4"
              >
                <span className="text-blue-100">Items:</span>
                <span className="font-semibold text-white bg-blue-500/30 px-3 py-1 rounded-full">
                  {cart.length}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Empty State */}
            {cart.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="mb-6 text-6xl text-blue-300">🛒</div>
                <p className="text-xl text-blue-100 font-medium">Your cart feels lonely</p>
                <p className="text-blue-200 mt-2">
                  Explore our <Link to="/foods" className="text-blue-300 hover:underline">delicious menu</Link>
                </p>
              </motion.div>
            )}

            {/* Cart Items */}
            {cart.length > 0 && (
              <>
                <div className="space-y-6 mb-8">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          {/* Item Info */}
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.div 
                              whileHover={{ rotate: 10 }}
                              className="bg-blue-500/20 p-3 rounded-lg"
                            >
                              <span className="text-2xl">🍔</span>
                            </motion.div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-3">
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-8 h-8 bg-blue-900/20 rounded flex items-center justify-center border border-blue-400/20 text-blue-100"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </motion.button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center bg-blue-900/10 border border-blue-400/20 rounded py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  min="1"
                                />
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-8 h-8 bg-blue-900/20 rounded flex items-center justify-center border border-blue-400/20 text-blue-100"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Price and Remove */}
                          <div className="text-right ml-4">
                            <p className="font-bold text-blue-100 text-xl">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <motion.button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removingItem === item.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-sm text-red-300 hover:text-red-200 mt-2 flex items-center gap-1 justify-end"
                            >
                              {removingItem === item.id ? (
                                <div className="w-4 h-4 border-2 border-red-300/30 rounded-full animate-spin border-t-red-300" />
                              ) : 'Remove'}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Total Amount */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end mb-8"
                >
                  <div className="text-right bg-blue-900/20 backdrop-blur-sm p-4 rounded-xl border border-blue-400/20">
                    <p className="text-sm text-blue-300 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-blue-100">
                      ₹{getCartTotal().toFixed(2)}
                    </p>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <label className="block text-sm font-medium text-blue-300 mb-3">
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter your delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-blue-900/20 backdrop-blur-sm border border-blue-400/20 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all placeholder-blue-400/50 text-white disabled:bg-blue-900/10"
                    rows={3}
                    disabled={loading}
                  />
                </motion.div>

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

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <motion.button
                    onClick={handleClearCart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 border-2 border-blue-400/30 text-blue-100 rounded-xl hover:bg-blue-900/20 transition-all"
                  >
                    Clear Cart
                  </motion.button>
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                        Processing Order...
                      </div>
                    ) : (
                      "Place Secure Order"
                    )}
                  </motion.button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Clear Cart Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-blue-900/20 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4 border border-blue-400/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">Clear Cart?</h3>
              <p className="text-blue-200 mb-6">This will remove all items from your cart.</p>
              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={() => setShowClearModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-blue-200 hover:text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmClearCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600/90"
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
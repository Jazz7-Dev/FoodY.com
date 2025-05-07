import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

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
          <p className="text-blue-100 text-xl font-medium">Loading your culinary journey...</p>
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
                Your Order History
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center space-x-2 mt-4"
              >
                <span className="text-blue-100">Total Orders:</span>
                <span className="font-semibold text-white bg-blue-500/30 px-3 py-1 rounded-full">
                  {orders?.length || 0}
                </span>
              </motion.div>
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

            {/* Empty State */}
            {!orders?.length && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="mb-6 text-6xl text-blue-300">📭</div>
                <p className="text-xl text-blue-100 font-medium">No culinary adventures recorded yet</p>
                <p className="text-blue-200 mt-2">Your future orders will appear here</p>
              </motion.div>
            )}

            {/* Orders List */}
            {orders?.length > 0 && (
              <div className="space-y-6">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order?._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            whileHover={{ rotate: 10 }}
                            className="bg-blue-500/20 p-3 rounded-lg"
                          >
                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                          </motion.div>
                          <div>
                            <p className="font-semibold text-white">Order #{order?._id?.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-blue-200">
                              {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                            </p>
                          </div>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                            order?.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 
                            order?.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {order?.status || 'Processing'}
                        </motion.div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <motion.div 
                          whileHover={{ y: -2 }}
                          className="bg-blue-900/20 p-4 rounded-lg border border-blue-400/20"
                        >
                          <p className="text-sm text-blue-300 mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Delivery Address
                          </p>
                          <p className="font-medium text-white">{order?.address || 'Address not available'}</p>
                        </motion.div>

                        <motion.div 
                          whileHover={{ y: -2 }}
                          className="bg-blue-900/20 p-4 rounded-lg border border-blue-400/20"
                        >
                          <p className="text-sm text-blue-300 mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Total Amount
                          </p>
                          <p className="font-bold text-blue-100 text-xl">
                            ₹{order?.totalAmount?.toFixed(2) || '00.00'}
                          </p>
                        </motion.div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-blue-400/20 pt-4">
                        <h3 className="text-sm font-semibold text-blue-300 mb-3">Items Ordered</h3>
                        <div className="space-y-3">
                          {order?.items?.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 5 }}
                              className="flex items-center justify-between p-3 bg-blue-900/10 rounded-lg hover:bg-blue-900/20 transition-colors border border-blue-400/10"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-300">🍔</span>
                                <span className="font-medium text-white">
                                  {item?.foodId?.name || 'Unknown Item'}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-blue-100">
                                  ₹{item?.foodId?.price ? item.foodId.price.toFixed(2) : '00.00'}
                                </p>
                                <p className="text-sm text-blue-300">Qty: {item?.quantity || 1}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
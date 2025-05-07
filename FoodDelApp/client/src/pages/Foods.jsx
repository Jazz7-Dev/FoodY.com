import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// Enhanced emoji mapping with more categories
const foodEmojis = {
  burger: "🍔",
  pizza: "🍕",
  sushi: "🍣",
  pasta: "🍝",
  salad: "🥗",
  dessert: "🍰",
  drink: "🥤",
  vegan: "🌱",
  spicy: "🌶️",
  breakfast: "🥞",
  default: "🍽️"
};

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cartRef = useRef(null);
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/foods");
        const foodsWithId = res.data.map(food => ({ 
          ...food, 
          id: food._id,
          image: food.image ? `http://localhost:5000${food.image}` : null
        }));
        
        // Simulate loading for demo purposes
        await new Promise(resolve => setTimeout(resolve, 800));
        setFoods(foodsWithId);
      } catch {
        setError("Failed to load the cosmic menu");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleAddToCart = async (food) => {
    setLoadingId(food.id);
    try {
      // Create flying item animation
      const itemElement = document.getElementById(`food-${food.id}`);
      if (itemElement) {
        const rect = itemElement.getBoundingClientRect();
        setFlyingItem({
          id: food.id,
          name: food.name,
          emoji: foodEmojis[food.category?.toLowerCase()] || foodEmojis.default,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
          endX: cartRef.current?.getBoundingClientRect().left || 0,
          endY: cartRef.current?.getBoundingClientRect().top || 0
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      addToCart(food);
      
      toast.success(`${food.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch {
      toast.error("Cosmic disturbance! Failed to add item");
    } finally {
      setTimeout(() => setFlyingItem(null), 1000);
      setLoadingId(null);
    }
  };

  if (isLoading) {
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
          <p className="text-blue-100 text-xl font-medium">Summoning cosmic delicacies...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer position="bottom-right" theme="dark" />
      
      {/* Cosmic Floating Cart Counter */}
      <div className="fixed top-6 right-6 z-50" ref={cartRef}>
        <Link to="/cart" className="relative group">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-lg p-3 rounded-full shadow-2xl border border-blue-400/20"
          >
            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {cart.length > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {cart.length}
              </motion.div>
            )}
          </motion.div>
        </Link>
      </div>

      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div 
          initial={{ 
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          }}
          animate={{ 
            x: flyingItem.endX - flyingItem.startX,
            y: flyingItem.endY - flyingItem.startY,
            opacity: 0,
            scale: 0.5
          }}
          transition={{ 
            duration: 1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="fixed z-50 text-3xl pointer-events-none"
          style={{
            left: `${flyingItem.startX}px`,
            top: `${flyingItem.startY}px`,
          }}
        >
          {flyingItem.emoji}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Cosmic Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 via-blue-100 to-white bg-clip-text text-transparent mb-4">
            Cosmic Culinary Delights
          </h1>
          <p className="text-blue-200 text-lg">Discover celestial flavors from across the universe</p>
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

        {/* Cosmic Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {foods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                id={`food-${food.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-blue-400/20 hover:border-blue-300/50 transition-all duration-300"
              >
                {/* Food Image */}
                <div className="h-64 bg-gradient-to-br from-blue-900/50 to-blue-800/50 flex items-center justify-center overflow-hidden relative">
                  {food.image ? (
                    <motion.img 
                      src={food.image} 
                      alt={food.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230f172a'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%233b82f6' text-anchor='middle' dominant-baseline='middle'%3E🍔%3C/text%3E%3C/svg%3E"
                      }}
                    />
                  ) : (
                    <motion.span 
                      className="text-7xl"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {foodEmojis[food.category?.toLowerCase()] || foodEmojis.default}
                    </motion.span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent" />
                </div>
                
                {/* Food Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <motion.h3 
                        whileHover={{ x: 2 }}
                        className="text-xl font-semibold text-white"
                      >
                        {food.name}
                      </motion.h3>
                      <p className="text-blue-200 text-sm mt-2">
                        {food.description || "A celestial culinary creation"}
                      </p>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="bg-blue-500/30 text-blue-100 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      ₹{food.price}
                    </motion.span>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={() => handleAddToCart(food)}
                    disabled={loadingId === food.id}
                    whileHover={{ scale: loadingId === food.id ? 1 : 1.05 }}
                    whileTap={{ scale: loadingId === food.id ? 1 : 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
                    {loadingId === food.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                        <span>Warping to Cart...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>Add to Cosmic Cart</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {foods.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="mb-6 text-8xl text-blue-300">👽</div>
            <p className="text-2xl text-blue-100 font-medium">Cosmic kitchen is empty</p>
            <p className="text-blue-200 mt-2">Our interstellar chefs are preparing something special</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
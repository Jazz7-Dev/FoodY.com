import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        const profileRes = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        setUser(profileRes.data);

        try {
          const statsRes = await axios.get(`${API_BASE_URL}/users/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (isMounted) setStats(statsRes.data);
        } catch (statsError) {
          console.warn("Stats not available:", statsError.message);
        }
      } catch (err) {
        if (isMounted) {
          let errorMessage = "Failed to load profile";
          if (err.response) {
            if (err.response.status === 401) errorMessage = "Please login again";
            else if (err.response.status === 404) errorMessage = "Profile not found";
            else errorMessage = err.response.data?.message || errorMessage;
          } else if (err.request) {
            errorMessage = "Server not responding";
          }
          setError(errorMessage);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileData();

    return () => { isMounted = false };
  }, [token]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
            }}
            className="w-20 h-20 border-4 border-blue-300 border-t-blue-100 rounded-full mx-auto"
          ></motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-blue-100"
          >
            Loading your Foody profile
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-blue-200"
          >
            Warping through the data stream...
          </motion.p>
        </motion.div>
        
        {/* Floating bubbles background */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: Math.random() * 100,
              x: Math.random() * 100,
              opacity: 0.3
            }}
            animate={{ 
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.6, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute rounded-full bg-blue-400/30"
            style={{
              width: `${5 + Math.random() * 20}px`,
              height: `${5 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-6 overflow-hidden">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-blue-400/30 relative z-10"
        >
          <motion.div 
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="bg-gradient-to-r from-blue-600/50 to-blue-400/50 p-8 text-center"
            style={{ backgroundSize: '200% 200%' }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
          </motion.div>
          <div className="p-8">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-4 text-center"
            >
               Error
            </motion.h2>
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-blue-100 mb-8 text-center text-lg"
            >
              {error}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Retry Connection
            </motion.button>
          </div>
        </motion.div>

        {/* Animated stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity }
            }}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-full inline-block border-4 border-blue-300/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white"
          >
            Profile Lost in PLates
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-blue-200 max-w-md mx-auto text-lg"
          >
            We couldn't retrieve your Foody profile data.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md"
          >
            Reconnect
          </motion.button>
        </motion.div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.8, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute rounded-full bg-blue-300/40"
            style={{
              width: `${3 + Math.random() * 10}px`,
              height: `${3 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated background elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -50, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute rounded-full bg-blue-400/10"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-blue-400/20"
        >
          {/* Profile Header with Animated Gradient */}
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
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 px-10 py-16 text-center relative overflow-hidden"
            style={{ backgroundSize: '400% 400%' }}
          >
            {/* Animated floating elements */}
            <motion.div 
              animate={{
                x: [0, 20, 0],
                y: [0, 10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto h-32 w-32 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl mb-8 border-4 border-white/20"
              >
                <motion.span 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity
                  }}
                  className="text-5xl font-bold text-blue-600"
                >
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </motion.span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {user.username || 'Cosmic Traveler'}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-blue-100 text-xl"
              >
                {user.email || 'Exploring the Foody universe'}
              </motion.p>
            </div>
          </motion.div>

          {/* Profile Content */}
          <div className="px-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Basic Info Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-400/20"
              >
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-2xl font-semibold text-white mb-8 pb-3 border-b border-blue-400/30 flex items-center"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="inline-block mr-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </motion.span>
                  Foody Identity
                </motion.h2>
                
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-blue-200 flex items-center">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="inline-block mr-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </motion.span>
                      Member Since
                    </span>
                    <span className="font-medium text-white" data-tooltip-id="member-tooltip">
                      {formatDate(user.createdAt)}
                    </span>
                    <Tooltip id="member-tooltip" place="top" className="z-50">
                      <div className="bg-blue-900/90 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 text-sm text-white">
                        {new Date(user.createdAt).toLocaleString()}
                        <div className="text-blue-300 mt-1">
                          Exploring for {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} foody days
                        </div>
                      </div>
                    </Tooltip>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-blue-200 flex items-center">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="inline-block mr-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.span>
                      Last Updated
                    </span>
                    <span className="font-medium text-white" data-tooltip-id="updated-tooltip">
                      {formatDate(user.updatedAt)}
                    </span>
                    <Tooltip id="updated-tooltip" place="top" className="z-50">
                      <div className="bg-blue-900/90 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 text-sm text-white">
                        {new Date(user.updatedAt).toLocaleString()}
                        <div className={`mt-1 ${new Date() - new Date(user.updatedAt) < 86400000 ? 'text-green-300' : 'text-amber-300'}`}>
                          {new Date() - new Date(user.updatedAt) < 86400000 ? 'Active in current time continuum' : 'Dormant in the digital cosmos'}
                        </div>
                      </div>
                    </Tooltip>
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats Card */}
              {stats && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-400/20"
                >
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="text-2xl font-semibold text-white mb-8 pb-3 border-b border-blue-400/30 flex items-center"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="inline-block mr-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </motion.span>
                    Foody Activity
                  </motion.h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-900/40 p-6 rounded-xl text-center border border-blue-500/30 backdrop-blur-sm"
                    >
                      <div className="text-4xl font-bold text-white mb-2">{stats.postCount || 0}</div>
                      <div className="text-sm text-blue-200 uppercase tracking-wider">Foody Posts</div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-900/40 p-6 rounded-xl text-center border border-blue-500/30 backdrop-blur-sm"
                    >
                      <div className="text-4xl font-bold text-white mb-2">{stats.commentsCount || 0}</div>
                      <div className="text-sm text-blue-200 uppercase tracking-wider">Foody Comments</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Edit Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mt-16 text-center"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-4 px-10 rounded-full inline-flex items-center shadow-xl"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-transparent opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Foody Profile
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      <AnimatePresence>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: Math.random() * 100,
              x: Math.random() * 100,
              opacity: 0
            }}
            animate={{ 
              y: [0, -100, -200],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute rounded-full bg-blue-300/40"
            style={{
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
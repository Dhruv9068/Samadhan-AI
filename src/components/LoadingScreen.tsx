import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader, Zap, Database } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center z-50">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-gentle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-gentle-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-lg flex items-center justify-center mx-auto"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Brain className="w-10 h-10 text-cream-50" />
            </motion.div>
            
            {/* Orbiting elements */}
            <motion.div
              className="absolute inset-0 w-20 h-20 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Samadhan AI
          </h1>
          <p className="text-lg text-gold-600">
            Intelligent Government Services Portal
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader className="w-5 h-5 text-gold-500 animate-spin" />
            <span className="text-gray-600 font-medium">Initializing AI Systems...</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-cream-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Service Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center space-x-6 text-sm">
            <motion.div
              className="flex items-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Firebase</span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">WatsonX</span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">OpenRouter</span>
            </motion.div>
          </div>
          
          <p className="text-xs text-gray-500">
            Connecting to AI services and real-time database...
          </p>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold-400 rounded-full opacity-30"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
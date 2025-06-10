import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Clock, Zap } from 'lucide-react';

interface SystemMetrics {
  activeUsers: number;
  queueSize: number;
  responseTime: number;
  systemLoad: number;
  processingRequests: number;
}

export const SystemLoadMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 1247,
    queueSize: 23,
    responseTime: 1.2,
    systemLoad: 78,
    processingRequests: 12
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        queueSize: Math.max(0, prev.queueSize + Math.floor(Math.random() * 6 - 3)),
        responseTime: Math.max(0.5, prev.responseTime + (Math.random() * 0.4 - 0.2)),
        systemLoad: Math.max(50, Math.min(95, prev.systemLoad + Math.floor(Math.random() * 10 - 5))),
        processingRequests: Math.max(0, prev.processingRequests + Math.floor(Math.random() * 4 - 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-100/30 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">System Load Monitor</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Users</p>
                <p className="text-xl font-bold text-blue-800">{metrics.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Queue Size</p>
                <p className="text-xl font-bold text-orange-800">{metrics.queueSize}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Avg Response</p>
                <p className="text-xl font-bold text-green-800">{metrics.responseTime.toFixed(1)}s</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Processing</p>
                <p className="text-xl font-bold text-purple-800">{metrics.processingRequests}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Load Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">System Load</span>
            <span className="text-sm font-bold text-gray-800">{metrics.systemLoad}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
            <motion.div 
              className={`h-3 rounded-full ${
                metrics.systemLoad > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                metrics.systemLoad > 80 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.systemLoad}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600 text-center">
          Real-time monitoring • Updates every 2 seconds
        </div>
      </div>
    </motion.div>
  );
};
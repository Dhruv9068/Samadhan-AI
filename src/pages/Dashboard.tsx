import React from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { SystemLoadMonitor } from '../components/Dashboard/SystemLoadMonitor';
import { ComplaintsList } from '../components/Complaints/ComplaintsList';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  AlertTriangle 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8 h-full">
      {/* Welcome Section */}
      <motion.div
        className="text-center py-6 lg:py-8 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-100/50 to-cream-200/50 rounded-xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Government Services Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gold-600 mb-4">
            Empowering efficient citizen service delivery
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <span>•</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total Complaints"
          value="2,847"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="gold"
          delay={0.1}
        />
        <StatsCard
          title="Resolved Today"
          value="156"
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
          color="green"
          delay={0.2}
        />
        <StatsCard
          title="Pending Review"
          value="89"
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          color="blue"
          delay={0.3}
        />
        <StatsCard
          title="Active Users"
          value="1,247"
          icon={Users}
          trend={{ value: 15, isPositive: true }}
          color="red"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 flex-1 min-h-0">
        {/* Complaints List */}
        <div className="xl:col-span-2 min-h-0">
          <ComplaintsList />
        </div>
        
        {/* System Monitor */}
        <div className="space-y-6 min-h-0">
          <SystemLoadMonitor />
          
          {/* Quick Actions */}
          <motion.div
            className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 lg:p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button 
                className="w-full text-left p-3 bg-gradient-to-r from-gold-100 to-gold-200 rounded-lg hover:from-gold-200 hover:to-gold-300 transition-all flex items-center space-x-3"
                whileHover={{ x: 4 }}
              >
                <TrendingUp className="w-5 h-5 text-gold-600" />
                <span className="font-medium text-gray-800">Generate Report</span>
              </motion.button>
              
              <motion.button 
                className="w-full text-left p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all flex items-center space-x-3"
                whileHover={{ x: 4 }}
              >
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">Priority Alerts</span>
              </motion.button>
              
              <motion.button 
                className="w-full text-left p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg hover:from-green-200 hover:to-green-300 transition-all flex items-center space-x-3"
                whileHover={{ x: 4 }}
              >
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-800">Manage Teams</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
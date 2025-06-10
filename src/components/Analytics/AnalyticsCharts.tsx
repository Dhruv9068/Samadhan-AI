import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';
import { Loader, TrendingUp, Users, Clock, Target } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { analytics, loading, error } = useRealTimeAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader className="w-8 h-8 animate-spin text-gold-500" />
          <span className="text-lg text-gray-600">Loading real-time analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading analytics: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Real-time Analytics Dashboard</h2>
        <p className="text-gold-600">Live insights from Supabase database</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-gold-400 to-gold-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h4 className="text-sm font-medium opacity-90">Resolution Rate</h4>
              <p className="text-3xl font-bold mt-2">{analytics.resolutionRate.toFixed(1)}%</p>
              <p className="text-sm opacity-75 mt-1">
                {analytics.resolvedComplaints} of {analytics.totalComplaints} resolved
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8" />
            <div>
              <h4 className="text-sm font-medium opacity-90">Avg Response Time</h4>
              <p className="text-3xl font-bold mt-2">{analytics.averageResponseTime.toFixed(1)}h</p>
              <p className="text-sm opacity-75 mt-1">Real-time calculation</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <div>
              <h4 className="text-sm font-medium opacity-90">Total Complaints</h4>
              <p className="text-3xl font-bold mt-2">{analytics.totalComplaints}</p>
              <p className="text-sm opacity-75 mt-1">Live from database</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h4 className="text-sm font-medium opacity-90">Pending Review</h4>
              <p className="text-3xl font-bold mt-2">{analytics.pendingComplaints}</p>
              <p className="text-sm opacity-75 mt-1">Requires attention</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Complaints by Category</h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </motion.div>

        {/* Department Performance */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Department Performance</h3>
          {analytics.departmentPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fffdf7',
                    border: '1px solid #d4af37',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="resolved" fill="#138808" name="Resolved" />
                <Bar dataKey="pending" fill="#ff9933" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Trends</h3>
        {analytics.monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics.monthlyTrends}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#138808" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#138808" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fffdf7',
                  border: '1px solid #d4af37',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="complaints"
                stroke="#d4af37"
                fillOpacity={1}
                fill="url(#colorComplaints)"
                name="Total Complaints"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#138808"
                fillOpacity={1}
                fill="url(#colorResolved)"
                name="Resolved"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        )}
      </motion.div>

      {/* Priority Distribution */}
      {analytics.priorityDistribution.length > 0 && (
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Priority Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.priorityDistribution.map((item, index) => (
              <div key={item.priority} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  item.priority === 'critical' ? 'bg-red-500' :
                  item.priority === 'high' ? 'bg-orange-500' :
                  item.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {item.count}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 capitalize">{item.priority}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
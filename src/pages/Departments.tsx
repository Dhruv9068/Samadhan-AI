import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Department } from '../types';

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Public Works',
    workload: 78,
    capacity: 100,
    averageResponseTime: 2.3
  },
  {
    id: '2',
    name: 'Water Supply',
    workload: 65,
    capacity: 80,
    averageResponseTime: 1.8
  },
  {
    id: '3',
    name: 'Environment',
    workload: 45,
    capacity: 60,
    averageResponseTime: 3.1
  },
  {
    id: '4',
    name: 'Traffic Police',
    workload: 32,
    capacity: 50,
    averageResponseTime: 0.9
  },
  {
    id: '5',
    name: 'Healthcare',
    workload: 28,
    capacity: 40,
    averageResponseTime: 4.2
  }
];

export const Departments: React.FC = () => {
  const getWorkloadColor = (workload: number, capacity: number) => {
    const percentage = (workload / capacity) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getWorkloadStatus = (workload: number, capacity: number) => {
    const percentage = (workload / capacity) * 100;
    if (percentage > 90) return 'Overloaded';
    if (percentage > 70) return 'High Load';
    return 'Normal';
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Department Management</h1>
        <p className="text-gold-600">Monitor workload and assign resources efficiently</p>
      </motion.div>

      <div className="grid gap-6">
        {mockDepartments.map((dept, index) => (
          <motion.div
            key={dept.id}
            className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Department Operations</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    getWorkloadStatus(dept.workload, dept.capacity) === 'Overloaded' ? 'bg-red-100 text-red-800' :
                    getWorkloadStatus(dept.workload, dept.capacity) === 'High Load' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getWorkloadStatus(dept.workload, dept.capacity)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Workload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Current Workload</span>
                    <span className="text-sm font-bold text-gray-800">{dept.workload}/{dept.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div 
                      className={`h-3 rounded-full ${getWorkloadColor(dept.workload, dept.capacity)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(dept.workload / dept.capacity) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {((dept.workload / dept.capacity) * 100).toFixed(0)}% capacity utilized
                  </p>
                </div>

                {/* Response Time */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-gold-600" />
                    <span className="text-sm font-medium text-gray-600">Avg Response Time</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{dept.averageResponseTime}h</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dept.averageResponseTime < 2 ? 'Excellent' : 
                     dept.averageResponseTime < 4 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <motion.button 
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-gold-600 hover:to-gold-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Assign New Cases
                  </motion.button>
                  <motion.button 
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-bold">Total Resolved</h3>
              <p className="text-3xl font-bold mt-1">1,247</p>
              <p className="text-sm opacity-80">This month</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-bold">Avg Response</h3>
              <p className="text-3xl font-bold mt-1">2.3h</p>
              <p className="text-sm opacity-80">Across all departments</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h3 className="text-lg font-bold">High Priority</h3>
              <p className="text-3xl font-bold mt-1">23</p>
              <p className="text-sm opacity-80">Pending assignment</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Brain,
  Search,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Complaints', href: '/complaints', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Departments', href: '/departments', icon: Users },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 
          bg-gradient-to-b from-cream-50 to-cream-100 shadow-xl border-r border-gold-200
          lg:translate-x-0 lg:shadow-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out lg:transition-none
        `}
        initial={false}
      >
        {/* Sidebar Content Container */}
        <div className="relative z-20 h-full flex flex-col">
          {/* Header Section */}
          <div className="flex-shrink-0 p-4 lg:p-6">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 mb-6 lg:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg shadow-md">
                <Brain className="w-6 h-6 text-cream-50" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Samadhan AI</h1>
                <p className="text-sm text-gold-600">Smart Governance</p>
              </div>
            </motion.div>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 lg:px-6 pb-4 lg:pb-6">
            {/* Navigation */}
            <nav className="space-y-2 mb-6 lg:mb-8">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => onClose && onClose()}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-cream-50 shadow-lg' 
                          : 'text-gray-700 hover:bg-cream-200 hover:text-gold-700'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* System Status */}
            <motion.div 
              className="p-4 bg-gradient-to-r from-cream-100 to-gold-100 rounded-lg border border-gold-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Firebase</span>
                  <span className="text-green-700 font-semibold">Connected</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Backend AI</span>
                  <span className="text-green-700 font-semibold">Active</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Real-time</span>
                  <span className="text-green-700 font-semibold">Live</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">System Health: 95%</p>
              </div>
            </motion.div>

            {/* Quick Stats - Hidden on small screens */}
            <div className="mt-6 space-y-4 hidden md:block">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Quick Stats</h4>
                <div className="text-xs text-blue-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolved Today:</span>
                    <span className="font-semibold">156</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">AI Performance</h4>
                <div className="text-xs text-purple-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-semibold">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-semibold">94.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Languages:</span>
                    <span className="font-semibold">10+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Effects - Non-interactive */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-aura-pulse"></div>
          <div className="absolute bottom-20 right-5 w-24 h-24 bg-gold-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-aura-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Particle effects - Non-interactive */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-saffron-500 rounded-full animate-particle-drift opacity-40 pointer-events-none z-1"></div>
        <div className="absolute top-20 right-2 w-1 h-1 bg-indianGreen-500 rounded-full animate-particle-drift opacity-30 pointer-events-none z-1" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-40 right-1 w-1.5 h-1.5 bg-indianBlue-500 rounded-full animate-particle-drift opacity-20 pointer-events-none z-1" style={{ animationDelay: '6s' }}></div>
      </motion.div>
    </>
  );
};
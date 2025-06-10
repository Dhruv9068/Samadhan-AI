import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon; // ✅ Add this line
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'gold' | 'green' | 'blue' | 'red';
  delay?: number;
}

const colorClasses = {
  gold: {
    bg: 'from-gold-400 to-gold-600',
    icon: 'bg-gold-100 text-gold-700',
    trend: 'text-gold-600',
  },
  green: {
    bg: 'from-green-400 to-green-600',
    icon: 'bg-green-100 text-green-700',
    trend: 'text-green-600',
  },
  blue: {
    bg: 'from-blue-400 to-blue-600',
    icon: 'bg-blue-100 text-blue-700',
    trend: 'text-blue-600',
  },
  red: {
    bg: 'from-red-400 to-red-600',
    icon: 'bg-red-100 text-red-700',
    trend: 'text-red-600',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon, // ✅ Destructure icon here
  trend,
  color,
  delay = 0,
}) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 sm:p-6 relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
    >
      {/* Background glow - Non-interactive */}
      <div
        className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl ${colors.bg} rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none`}
      ></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <span className={`p-1 rounded-full ${colors.icon}`}>
              <Icon className="w-4 h-4" />
            </span>
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 truncate">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center text-sm ${colors.trend}`}>
              <span>{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%</span>
              <span className="ml-1 text-gray-500 hidden sm:inline">from last month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

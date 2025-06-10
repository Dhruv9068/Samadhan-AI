import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, Globe } from 'lucide-react';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { SearchBar } from '../Search/SearchBar';

interface HeaderProps {
  onMenuClick?: () => void;
  onComplaintSelect?: (complaint: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onComplaintSelect }) => {
  const { user, signOut } = useFirebaseAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <motion.header 
      className="bg-cream-50 border-b border-gold-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 relative overflow-hidden z-30 flex-shrink-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background aura - Non-interactive */}
      <div className="absolute top-0 right-20 w-20 h-20 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-gentle-float pointer-events-none"></div>
      
      <div className="flex items-center justify-between relative z-40 w-full">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-cream-200 transition-colors flex-shrink-0 z-50"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
              Welcome to Samadhan AI
            </h2>
            <p className="text-xs sm:text-sm text-gold-600 flex items-center space-x-1 sm:space-x-2 flex-wrap">
              <span className="hidden sm:inline">AI system</span>
              <span className="sm:hidden">🏆 AI System</span>
              <span>•</span>
              <span className="hidden md:inline text-xs">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0 z-50">
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block">
            <SearchBar 
              placeholder="Search complaints, departments..."
              className="w-64 xl:w-80"
              onComplaintSelect={onComplaintSelect}
            />
          </div>

          {/* Language Toggle */}
          <div className="relative">
            <motion.button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="p-2 rounded-lg hover:bg-cream-200 transition-colors relative z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
            </motion.button>
            
            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-cream-50 rounded-lg shadow-lg border border-gold-200 p-2 z-[100] min-w-[180px] sm:min-w-[200px]"
                >
                  <div className="text-xs space-y-1">
                    {[
                      { code: 'en', flag: '🇺🇸', name: 'English' },
                      { code: 'hi', flag: '🇮🇳', name: 'हिंदी' },
                      { code: 'bn', flag: '🇮🇳', name: 'বাংলা' },
                      { code: 'ta', flag: '🇮🇳', name: 'தமிழ்' },
                      { code: 'te', flag: '🇮🇳', name: 'తెలుగు' },
                      { code: 'mr', flag: '🇮🇳', name: 'मराठी' },
                      { code: 'gu', flag: '🇮🇳', name: 'ગુજરાતી' },
                      { code: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ' },
                    ].map((lang) => (
                      <div 
                        key={lang.code}
                        className="px-3 py-2 hover:bg-gold-100 rounded cursor-pointer flex items-center space-x-2"
                        onClick={() => setShowLanguageMenu(false)}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-100 to-cream-200 rounded-lg px-2 py-2 sm:px-3 border border-gold-300 z-50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-cream-50" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[100px] lg:max-w-[120px]">
                  {user?.displayName || user?.email || 'Admin User'}
                </p>
                <p className="text-xs text-gold-600">System Admin</p>
              </div>
            </motion.button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-cream-50 rounded-lg shadow-lg border border-gold-200 p-2 z-[100] min-w-[180px]"
                >
                  <div className="sm:hidden px-3 py-2 border-b border-gold-200 mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.displayName || user?.email || 'Admin User'}
                    </p>
                    <p className="text-xs text-gold-600">System Administrator</p>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gold-100 rounded">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gold-100 rounded">
                      Preferences
                    </button>
                    <hr className="border-gold-200" />
                    {user && (
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden mt-3 sm:mt-4 relative z-40">
        <SearchBar 
          placeholder="Search complaints, departments, services..." 
          onComplaintSelect={onComplaintSelect}
        />
      </div>
    </motion.header>
  );
};
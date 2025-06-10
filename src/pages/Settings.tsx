import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Globe, Palette, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsState {
  language: string;
  timezone: string;
  refreshInterval: string;
  notifications: {
    newComplaints: boolean;
    highPriority: boolean;
    emailSummaries: boolean;
  };
  theme: string;
  particleEffects: boolean;
  sessionTimeout: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    language: 'English',
    timezone: 'IST (UTC+05:30)',
    refreshInterval: 'Every 30 seconds',
    notifications: {
      newComplaints: true,
      highPriority: true,
      emailSummaries: false,
    },
    theme: 'indian-gold',
    particleEffects: true,
    sessionTimeout: '30 minutes',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('samadhan-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedSettings = localStorage.getItem('samadhan-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setHasChanges(JSON.stringify(settings) !== JSON.stringify(parsed));
      } catch (error) {
        setHasChanges(true);
      }
    } else {
      setHasChanges(true);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('samadhan-settings', JSON.stringify(settings));
      
      // Apply theme changes
      applyTheme(settings.theme);
      
      // Apply particle effects
      document.body.classList.toggle('no-particles', !settings.particleEffects);
      
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'ocean-blue':
        root.style.setProperty('--primary-color', '#3b82f6');
        root.style.setProperty('--primary-light', '#dbeafe');
        break;
      case 'forest-green':
        root.style.setProperty('--primary-color', '#10b981');
        root.style.setProperty('--primary-light', '#d1fae5');
        break;
      case 'indian-gold':
      default:
        root.style.setProperty('--primary-color', '#d4af37');
        root.style.setProperty('--primary-light', '#fef9c3');
        break;
    }
  };

  const updateSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotifications = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gold-600">Configure your dashboard preferences</p>
        </div>
        
        {hasChanges && (
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50"
            whileHover={{ scale: isSaving ? 1 : 1.02 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* General Settings */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 sm:p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gold-500 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Language
              </label>
              <select 
                value={settings.language}
                onChange={(e) => updateSettings('language', e.target.value)}
                className="w-full p-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Marathi">मराठी (Marathi)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select 
                value={settings.timezone}
                onChange={(e) => updateSettings('timezone', e.target.value)}
                className="w-full p-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="IST (UTC+05:30)">IST (UTC+05:30)</option>
                <option value="UTC">UTC</option>
                <option value="PST (UTC-08:00)">PST (UTC-08:00)</option>
                <option value="EST (UTC-05:00)">EST (UTC-05:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Interval
              </label>
              <select 
                value={settings.refreshInterval}
                onChange={(e) => updateSettings('refreshInterval', e.target.value)}
                className="w-full p-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="Every 30 seconds">Every 30 seconds</option>
                <option value="Every minute">Every minute</option>
                <option value="Every 5 minutes">Every 5 minutes</option>
                <option value="Every 10 minutes">Every 10 minutes</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 sm:p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">New Complaints</p>
                <p className="text-sm text-gray-600">Get notified of new complaint submissions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.newComplaints}
                  onChange={(e) => updateNotifications('newComplaints', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">High Priority Alerts</p>
                <p className="text-sm text-gray-600">Immediate alerts for critical issues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.highPriority}
                  onChange={(e) => updateNotifications('highPriority', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Summaries</p>
                <p className="text-sm text-gray-600">Daily report summaries via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.emailSummaries}
                  onChange={(e) => updateNotifications('emailSummaries', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 sm:p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <motion.button 
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enabled
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <select 
                value={settings.sessionTimeout}
                onChange={(e) => updateSettings('sessionTimeout', e.target.value)}
                className="p-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              >
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="4 hours">4 hours</option>
              </select>
            </div>

            <motion.button 
              className="w-full bg-gold-500 text-white py-3 rounded-lg font-medium hover:bg-gold-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success('Password change feature coming soon!')}
            >
              Change Password
            </motion.button>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-4 sm:p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Theme
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className={`p-3 border-2 rounded-lg bg-gradient-to-r from-cream-100 to-gold-100 cursor-pointer transition-all ${
                    settings.theme === 'indian-gold' ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gray-200 hover:border-gold-300'
                  }`}
                  onClick={() => updateSettings('theme', 'indian-gold')}
                >
                  <div className="w-full h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded mb-2"></div>
                  <p className="text-xs font-medium text-center">Indian Gold</p>
                </div>
                <div 
                  className={`p-3 border-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 cursor-pointer transition-all ${
                    settings.theme === 'ocean-blue' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => updateSettings('theme', 'ocean-blue')}
                >
                  <div className="w-full h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded mb-2"></div>
                  <p className="text-xs font-medium text-center">Ocean Blue</p>
                </div>
                <div 
                  className={`p-3 border-2 rounded-lg bg-gradient-to-r from-green-100 to-green-200 cursor-pointer transition-all ${
                    settings.theme === 'forest-green' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => updateSettings('theme', 'forest-green')}
                >
                  <div className="w-full h-8 bg-gradient-to-r from-green-400 to-green-600 rounded mb-2"></div>
                  <p className="text-xs font-medium text-center">Forest Green</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Particle Effects</p>
                <p className="text-sm text-gray-600">Subtle animations and effects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.particleEffects}
                  onChange={(e) => updateSettings('particleEffects', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button - Mobile */}
      {hasChanges && (
        <motion.div
          className="lg:hidden flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg disabled:opacity-50"
            whileHover={{ scale: isSaving ? 1 : 1.02, y: -2 }}
            whileTap={{ scale: isSaving ? 1 : 0.98 }}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
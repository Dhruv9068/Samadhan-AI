import React from 'react';
import { motion } from 'framer-motion';
import { VoiceChatbot } from '../components/Chat/VoiceChatbot';

export const Chat: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Chat Assistant</h1>
        <p className="text-gold-600">Voice-enabled multilingual support powered by Gemini AI</p>
      </motion.div>
      
      <VoiceChatbot />
    </div>
  );
};
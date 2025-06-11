import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Bot, 
  User, 
  Globe,
  Loader,
  Trash2,
  Database,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Award
} from 'lucide-react';
import { useAdvancedVoiceChat } from '../../hooks/useAdvancedVoiceChat';

export const VoiceChatbot: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [firebaseStatus, setFirebaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    currentLanguage,
    startListening,
    stopListening,
    stopSpeaking,
    sendTextMessage,
    setCurrentLanguage,
    clearChat
  } = useAdvancedVoiceChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Check services status on component mount
  useEffect(() => {
    const checkServicesStatus = async () => {
      try {
        // Check Firebase status
        const { isFirebaseInitialized } = await import('../../lib/firebase');
        setFirebaseStatus(isFirebaseInitialized() ? 'connected' : 'error');
        
        // Check Backend status
        console.log('🔍 Testing Samadhan AI backend...');
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        try {
          const response = await fetch(`${backendUrl}/health`);
          if (response.ok) {
            const data = await response.json();
            setBackendStatus(data.status === 'healthy' ? 'connected' : 'error');
            console.log('✅ Samadhan AI backend connected:', data);
          } else {
            setBackendStatus('error');
            console.error('Backend health check failed:', response.status);
          }
        } catch (error) {
          setBackendStatus('error');
          console.error('Backend connection failed:', error);
        }
        
        // console.log('🔍 Service Status Check:');
        // console.log('Firebase:', isFirebaseInitialized() ? '✅ Connected' : '❌ Error');
        // console.log('Samadhan AI Backend:', backendStatus === 'connected' ? '✅ Connected' : '❌ Error');
        
      } catch (error) {
        console.error('Services status check failed:', error);
        setBackendStatus('error');
        setFirebaseStatus('error');
      }
    };

    checkServicesStatus();
  }, []);

  const handleSendMessage = async () => {
    if (textInput.trim()) {
      await sendTextMessage(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Listening...';
    if (isProcessing) return 'Processing with Samadhan AI...';
    if (isSpeaking) return 'Speaking...';
    return 'Ready';
  };

  const getStatusColor = () => {
    if (isListening) return 'text-blue-600';
    if (isProcessing) return 'text-orange-600';
    if (isSpeaking) return 'text-green-600';
    return 'text-gray-600';
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader className="w-3 h-3 animate-spin text-yellow-500" />;
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500" />;
    }
  };

  const getServiceStatusText = (service: string, status: string) => {
    switch (status) {
      case 'checking':
        return `Connecting to ${service}...`;
      case 'connected':
        return `${service} Connected`;
      case 'error':
        return `${service} Connection Error`;
      default:
        return `${service} Status Unknown`;
    }
  };

  const getOverallSystemStatus = () => {
    const connectedServices = [firebaseStatus, backendStatus].filter(s => s === 'connected').length;
    const totalServices = 2;
    
    if (connectedServices === totalServices) return 'all-connected';
    if (connectedServices > 0) return 'partial';
    return 'disconnected';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-400 to-gold-600 p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-300/20 to-gold-500/20 animate-gentle-float"></div>
          <div className="relative z-10 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold">Samadhan AI Assistant</h2>
                  <Award className="w-4 h-4 text-yellow-300" />
                </div>
                <p className="text-xs sm:text-sm opacity-90 flex items-center space-x-2 flex-wrap">
                  {getServiceStatusIcon(firebaseStatus)}
                  <span>Firebase</span>
                  <span>•</span>
                  {getServiceStatusIcon(backendStatus)}
                  <span>AI Backend</span>
                  <span>•</span>
                  <span className="text-yellow-300">Highly Trained</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Language Selector */}
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="bg-cream-600  rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <option value="en-US">🇺🇸 English</option>
                <option value="hi-IN">🇮🇳 हिंदी</option>
                <option value="bn-IN">🇮🇳 বাংলা</option>
                <option value="ta-IN">🇮🇳 தமிழ்</option>
                <option value="te-IN">🇮🇳 తెలుగు</option>
                <option value="mr-IN">🇮🇳 मराठी</option>
                <option value="gu-IN">🇮🇳 ગુજરાતી</option>
                <option value="kn-IN">🇮🇳 ಕನ್ನಡ</option>
                <option value="ml-IN">🇮🇳 മലയാളം</option>
                <option value="pa-IN">🇮🇳 ਪੰਜਾਬੀ</option>
              </select>
              
              {/* System Status */}
              <div className="flex items-center justify-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  getOverallSystemStatus() === 'all-connected' ? 'bg-green-300 animate-pulse' :
                  getOverallSystemStatus() === 'partial' ? 'bg-yellow-300 animate-pulse' :
                  'bg-red-300 animate-pulse'
                }`}></div>
                <span className="text-sm font-medium">
                  {getStatusText()}
                </span>
              </div>

              {/* Clear Chat */}
              <motion.button
                onClick={clearChat}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Services Status Banner */}
        {getOverallSystemStatus() !== 'all-connected' && (
          <div className={`px-4 sm:px-6 py-3 border-b ${
            getOverallSystemStatus() === 'partial' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  {getServiceStatusIcon(firebaseStatus)}
                  <span className={`text-sm font-medium ${
                    getOverallSystemStatus() === 'partial' ? 'text-yellow-800' : 'text-red-800'
                  }`}>
                    {getServiceStatusText('Firebase', firebaseStatus)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getServiceStatusIcon(backendStatus)}
                  <span className={`text-sm font-medium ${
                    getOverallSystemStatus() === 'partial' ? 'text-yellow-800' : 'text-red-800'
                  }`}>
                    {getServiceStatusText('Samadhan AI', backendStatus)}
                  </span>
                </div>
              </div>
              {getOverallSystemStatus() !== 'all-connected' && (
                <span className={`text-xs ${
                  getOverallSystemStatus() === 'partial' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getOverallSystemStatus() === 'partial' ? '(Partial functionality available)' : '(Using fallback responses)'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-80 sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-cream-50 to-cream-100">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                className="text-center py-6 sm:py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-gold-500" />
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Samadhan AI</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
                  AI system for UP CM Helpline 1076 automation
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    firebaseStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>Firebase Real-time</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    backendStatus === 'connected' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                  }`}>WatsonX + DeepSeek AI</span>
                  <span className="px-2 py-1 bg-gold-100 text-gold-700 rounded-full text-xs">Voice Support</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">10+ Languages</span>
                
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 max-w-2xl mx-auto px-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <strong>💡 Try saying:</strong><br />
                    "Street lights not working in my area"
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <strong>🔍 Or ask:</strong><br />
                    "Water supply problem in locality"
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <strong>🚦 Traffic issues:</strong><br />
                    "Traffic signal not working"
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <strong>🏥 Healthcare:</strong><br />
                    "Hospital services complaint"
                  </div>
                </div>
                
                {/* Services Status Indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
                    firebaseStatus === 'connected' ? 'bg-green-100 text-green-800' :
                    firebaseStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getServiceStatusIcon(firebaseStatus)}
                    <span>Firebase</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
                    backendStatus === 'connected' ? 'bg-green-100 text-green-800' :
                    backendStatus === 'checking' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getServiceStatusIcon(backendStatus)}
                    <span>Samadhan AI</span>
                  </div>
                </div>

           
                {backendStatus === 'connected' && (
                  <div className="mt-4 text-xs text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span>AI-powered UP CM Helpline 1076 automation</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <Info className="w-3 h-3" />
                      <span>Tech Stack: WatsonX LLM • OpenRouter DeepSeek • RAG • Python ML</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white' 
                    : 'bg-white border border-gold-200 text-gray-800 shadow-sm'
                }`}>
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <Brain className="w-4 h-4 mt-1 text-gold-600 flex-shrink-0" />
                    )}
                    {message.isUser && (
                      <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        <div className='flex justify-between items-center'>
                        {message.timestamp.toLocaleTimeString()}
                        <p>Samadhan AI</p>
                        </div>
                        {message.language && ` • ${message.language}`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {isProcessing && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white border border-gold-200 rounded-xl px-4 py-3 flex items-center space-x-2 shadow-sm">
                  <Brain className="w-4 h-4 text-gold-600" />
                  <Loader className="w-4 h-4 text-gold-600 animate-spin" />
                  <span className="text-sm text-gray-600">Processing with Samadhan AI...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-cream-100 border-t border-gold-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Voice Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <motion.button
                className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-gold-500 hover:bg-gold-600 text-white'
                }`}
                onClick={isListening ? stopListening : startListening}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>

              <motion.button
                className={`p-2 rounded-full transition-all duration-200 ${
                  isMuted
                    ? 'bg-gray-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  }
                  setIsMuted(!isMuted);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMuted || !isSpeaking ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              </motion.button>
            </div>

            {/* Text Input */}
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your complaint or use voice..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm sm:text-base"
                disabled={isProcessing}
              />
              <motion.button
                onClick={handleSendMessage}
                className="p-2 sm:p-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                disabled={!textInput.trim() || isProcessing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>

          {/* Enhanced Status Bar */}
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs text-gray-600 mb-2">
              🎤 Voice recognition • 🧠 WatsonX + DeepSeek AI • 💾 Auto-saves complaints • 🌐 10+ languages • 🔥 Real-time Firebase 
            </p>
            
            {/* Service Status Indicators */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs">
              <div className={`flex items-center space-x-1 ${
                firebaseStatus === 'connected' ? 'text-green-600' : 
                firebaseStatus === 'checking' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getServiceStatusIcon(firebaseStatus)}
                <span>Firebase</span>
              </div>
              <div className={`flex items-center space-x-1 ${
                backendStatus === 'connected' ? 'text-green-600' : 
                backendStatus === 'checking' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getServiceStatusIcon(backendStatus)}
                <span>Samadhan AI</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
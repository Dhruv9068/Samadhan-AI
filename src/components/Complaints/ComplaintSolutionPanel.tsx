import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  Loader, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  X
} from 'lucide-react';
import { watsonAssistant } from '../../lib/watson';
import { langchainRAG } from '../../lib/langchain';
import toast from 'react-hot-toast';

interface ComplaintSolutionPanelProps {
  complaint: {
    title: string;
    description: string;
    category: string;
    priority: string;
  };
  onClose: () => void;
}

export const ComplaintSolutionPanel: React.FC<ComplaintSolutionPanelProps> = ({ 
  complaint, 
  onClose 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);

  const generateSolution = async () => {
    setIsProcessing(true);
    try {
      // Get AI-powered solution
      const aiSolution = await langchainRAG.generateSmartResponse(
        `${complaint.title}. ${complaint.description}`,
        complaint.category,
        'en'
      );
      
      // Get WatsonX response
      const watsonResponse = await watsonAssistant.generateComplaintResponse(
        `${complaint.title}. ${complaint.description}`,
        complaint.category,
        complaint.priority,
        'en'
      );
      
      setSolution(`${aiSolution}\n\nAdditional guidance: ${watsonResponse}`);
      toast.success('AI solution generated successfully!');
    } catch (error) {
      console.error('Error generating solution:', error);
      toast.error('Failed to generate solution. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser.');
    }
  };

  const sendMessage = async () => {
    if (!textInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: textInput,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setTextInput('');
    setIsProcessing(true);
    
    try {
      const response = await watsonAssistant.sendMessage(
        `Regarding complaint: ${complaint.title}. User question: ${textInput}`,
        'en'
      );
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-cream-50 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Solution Assistant</h2>
                <p className="text-sm opacity-90">Get intelligent solutions for your complaint</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Complaint Summary */}
          <div className="bg-gradient-to-r from-gold-50 to-orange-50 border border-gold-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Your Complaint</h3>
            <p className="text-sm text-gray-700 mb-2"><strong>Title:</strong> {complaint.title}</p>
            <p className="text-sm text-gray-700 mb-2"><strong>Category:</strong> {complaint.category}</p>
            <p className="text-sm text-gray-700"><strong>Priority:</strong> {complaint.priority}</p>
          </div>

          {/* Generate Solution Button */}
          {!solution && (
            <div className="text-center">
              <motion.button
                onClick={generateSolution}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 mx-auto"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating AI Solution...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    <span>Generate AI Solution</span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* AI Solution */}
          {solution && (
            <motion.div
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">AI-Generated Solution</h3>
              </div>
              <div className="text-sm text-green-700 whitespace-pre-line">
                {solution}
              </div>
            </motion.div>
          )}

          {/* Chat Interface */}
          <div className="border border-gold-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gold-100 to-orange-100 p-4 border-b border-gold-200">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Questions About Your Complaint
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-cream-50 to-cream-100">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm">
                  Ask questions about your complaint or request additional help
                </div>
              )}
              
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white' 
                        : 'bg-white border border-gold-200 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isProcessing && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white border border-gold-200 rounded-lg px-4 py-2 flex items-center space-x-2">
                    <Loader className="w-4 h-4 text-gold-600 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-cream-100 border-t border-gold-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={startVoiceInput}
                  disabled={isListening || isProcessing}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gold-500 hover:bg-gold-600 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a question about your complaint..."
                  className="flex-1 px-3 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  disabled={isProcessing}
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!textInput.trim() || isProcessing}
                  className="p-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {isListening && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-red-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    Listening... Speak now
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
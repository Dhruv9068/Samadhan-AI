import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Loader, Brain, Zap, CheckCircle, Mic, MicOff } from 'lucide-react';
import { useRealTimeComplaints } from '../../hooks/useRealTimeComplaints';
import { langchainRAG } from '../../lib/langchain';
import { watsonAssistant } from '../../lib/watson';
import toast from 'react-hot-toast';

interface ComplaintFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onClose, onSubmit }) => {
  const { addComplaint } = useRealTimeComplaints();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [watsonxResponse, setWatsonxResponse] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactInfo: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  const categories = [
    'Infrastructure',
    'Utilities',
    'Environment',
    'Traffic',
    'Healthcare',
    'Education',
    'Other'
  ];

  const startVoiceInput = (field: 'title' | 'description') => {
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
        setFormData(prev => ({ ...prev, [field]: transcript }));
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

  const handleAIAnalysis = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please enter title and description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Process with OpenRouter DeepSeek for analysis
      const analysis = await langchainRAG.processComplaintWithRAG(
        `${formData.title}. ${formData.description}`,
        'en'
      );
      
      setAiAnalysis(analysis);
      
      // Get WatsonX response
      const watsonResponse = await watsonAssistant.generateComplaintResponse(
        `${formData.title}. ${formData.description}`,
        analysis.category,
        analysis.priority,
        'en'
      );
      
      setWatsonxResponse(watsonResponse);
      
      // Auto-fill form with AI suggestions
      setFormData(prev => ({
        ...prev,
        category: analysis.category,
        priority: analysis.priority,
      }));
      
      toast.success('AI analysis completed! Form auto-filled with suggestions.');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI analysis failed. You can still submit manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let analysis = aiAnalysis;
      let smartResponse = watsonxResponse;
      
      // If no AI analysis was done, do it now
      if (!analysis) {
        analysis = await langchainRAG.processComplaintWithRAG(
          `${formData.title}. ${formData.description}`,
          'en'
        );

        // Get WatsonX response
        smartResponse = await watsonAssistant.generateComplaintResponse(
          `${formData.title}. ${formData.description}`,
          analysis.category,
          analysis.priority,
          'en'
        );
      }

      // Determine department based on category
      const departmentMap: Record<string, string> = {
        'Infrastructure': 'Public Works',
        'Utilities': 'Water Supply',
        'Environment': 'Environment',
        'Traffic': 'Traffic Police',
        'Healthcare': 'Healthcare',
        'Education': 'Education',
        'Other': 'General Services'
      };

      const finalCategory = formData.category || analysis.category;
      const department = departmentMap[finalCategory] || 'General Services';

      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: finalCategory,
        priority: formData.priority || analysis.priority,
        status: 'pending' as const,
        department,
        sentiment: analysis.sentiment,
        watson_reply: smartResponse,
        location: formData.location || null,
        contact_info: formData.contactInfo || null,
        assigned_to: null,
        user_id: null,
        resolved_at: null,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await addComplaint(complaintData);

      if (error) {
        toast.error(`Failed to submit complaint: ${error}`);
        return;
      }

      toast.success('Complaint submitted successfully with AI analysis!');
      onSubmit();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-cream-50 rounded-xl shadow-xl p-4 sm:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: '2rem' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Submit New Complaint</h2>
              <p className="text-sm text-gold-600">AI-powered analysis with voice input support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Title *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Brief description of the issue"
              />
              <button
                type="button"
                onClick={() => startVoiceInput('title')}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                  isListening ? 'text-red-500' : 'text-gold-500 hover:text-gold-600'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <div className="relative">
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
                placeholder="Provide detailed information about the complaint"
              />
              <button
                type="button"
                onClick={() => startVoiceInput('description')}
                className={`absolute right-3 top-3 p-1 rounded ${
                  isListening ? 'text-red-500' : 'text-gold-500 hover:text-gold-600'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            {isListening && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Listening... Speak now
              </p>
            )}
          </div>

          {/* AI Analysis Button */}
          <div className="flex justify-center">
            <motion.button
              type="button"
              onClick={handleAIAnalysis}
              disabled={isAnalyzing || !formData.title || !formData.description}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isAnalyzing ? 1 : 1.02 }}
              whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze with AI</span>
                </>
              )}
            </motion.button>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <motion.div
              className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis Results
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-600 font-medium">Category:</span>
                  <span className="ml-2 text-purple-800">{aiAnalysis.category}</span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    aiAnalysis.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    aiAnalysis.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    aiAnalysis.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {aiAnalysis.priority}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">Department:</span>
                  <span className="ml-2 text-purple-800">{aiAnalysis.department}</span>
                </div>
                <div>
                  <span className="text-purple-600 font-medium">Sentiment:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    aiAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    aiAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {aiAnalysis.sentiment}
                  </span>
                </div>
              </div>
              
              {/* WatsonX Response */}
              {watsonxResponse && (
                <div className="mt-3">
                  <span className="text-purple-600 font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    AI Response:
                  </span>
                  <p className="mt-1 text-purple-800 text-sm italic bg-white/50 p-3 rounded-lg">
                    "{watsonxResponse}"
                  </p>
                </div>
              )}
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="">Auto-detect with AI</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Address or location details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Phone number or email"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Processing Pipeline
            </h4>
            <p className="text-sm text-blue-600 mb-2">
              Your complaint will be processed through our advanced AI system:
            </p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• <strong>Voice Input:</strong> Speech-to-text conversion for easy input</li>
              <li>• <strong>OpenRouter DeepSeek:</strong> Advanced categorization & analysis</li>
              <li>• <strong>WatsonX LLM:</strong> Enterprise-grade AI response generation</li>
              <li>• <strong>Smart Routing:</strong> Automatic department assignment</li>
              <li>• <strong>Sentiment Analysis:</strong> Emotion detection & priority scoring</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing with AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
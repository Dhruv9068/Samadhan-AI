import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle,  User, ArrowRight, Plus, Brain, Lightbulb } from 'lucide-react';
import { useRealTimeComplaints } from '../../hooks/useRealTimeComplaints';
import { ComplaintForm } from './ComplaintForm';
import { ComplaintSolutionPanel } from './ComplaintSolutionPanel';
import { Complaint } from '../../types';

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  assigned: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

export const ComplaintsList: React.FC = () => {
  const { complaints, loading, error, updateComplaint } = useRealTimeComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSolutionPanel, setShowSolutionPanel] = useState(false);
  const [solutionComplaint, setSolutionComplaint] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading complaints: {error}</p>
      </div>
    );
  }

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === 'resolved') {
      updates.resolved_at = new Date().toISOString();
    }
    
    const { error } = await updateComplaint(complaintId, updates);
    if (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleGetSolution = (complaint: Complaint) => {
    setSolutionComplaint({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority
    });
    setShowSolutionPanel(true);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Real-time Complaints</h2>
          <p className="text-gold-600 mt-1">Live updates from Firebase • {complaints.length} total</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <motion.button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Complaint</span>
          </motion.button>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live Feed</span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4">
        <AnimatePresence>
          {complaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              className="bg-cream-50 rounded-xl shadow-md border border-gold-200 p-4 lg:p-6 hover:shadow-lg transition-shadow relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-gold-600 transition-colors line-clamp-2"
                        onClick={() => setSelectedComplaint(complaint)}>
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{complaint.description}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <motion.button
                      onClick={() => handleGetSolution(complaint)}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Brain className="w-4 h-4" />
                      <span className="hidden sm:inline">Get AI Solution</span>
                      <span className="sm:hidden">Solution</span>
                    </motion.button>
                    
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="flex items-center justify-center space-x-2 text-gold-600 hover:text-gold-700 transition-colors px-3 py-2"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[complaint.priority]}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[complaint.status]}`}>
                      {complaint.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(complaint.submitted_at).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span className="truncate max-w-[120px] sm:max-w-none">{complaint.department}</span>
                    {complaint.assigned_to && (
                      <>
                        <span>•</span>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[100px] sm:max-w-none">{complaint.assigned_to}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {complaints.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="w-12 h-12 text-gold-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No complaints yet</h3>
            <p className="text-gray-600 mb-4">Start by adding a new complaint or wait for real-time updates.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
            >
              Add First Complaint
            </button>
          </motion.div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedComplaint(null)}
          >
            <motion.div
              className="bg-cream-50 rounded-xl shadow-xl p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{selectedComplaint.title}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[selectedComplaint.priority]}`}>
                      {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedComplaint.status]}`}>
                      {selectedComplaint.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedComplaint.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedComplaint.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{new Date(selectedComplaint.submitted_at).toLocaleString()}</span>
                      </div>
                      {selectedComplaint.assigned_to && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned to:</span>
                          <span className="font-medium">{selectedComplaint.assigned_to}</span>
                        </div>
                      )}
                      {selectedComplaint.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedComplaint.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sentiment:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedComplaint.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          selectedComplaint.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        
                        </span>
                      </div>
                      
                      {selectedComplaint.watson_reply && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">AI Response:</p>
                          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {selectedComplaint.watson_reply}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gold-200 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={selectedComplaint.status}
                      onChange={(e) => handleStatusUpdate(selectedComplaint.id, e.target.value)}
                      className="px-3 py-2 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    
                    <motion.button
                      onClick={() => {
                        handleGetSolution(selectedComplaint);
                        setSelectedComplaint(null);
                      }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Get AI Solution</span>
                    </motion.button>
                  </div>
                  
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaint Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ComplaintForm
            onClose={() => setShowForm(false)}
            onSubmit={() => {
              setShowForm(false);
              // Complaints will be updated automatically via real-time subscription
            }}
          />
        )}
      </AnimatePresence>

      {/* Solution Panel */}
      <AnimatePresence>
        {showSolutionPanel && solutionComplaint && (
          <ComplaintSolutionPanel
            complaint={solutionComplaint}
            onClose={() => {
              setShowSolutionPanel(false);
              setSolutionComplaint(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const handleComplaintSelect = (complaint: any) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="flex h-screen bg-cream-50 relative overflow-hidden">
      {/* Background effects - Non-interactive, lowest z-index */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-gentle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-300 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-gentle-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Sidebar Component */}
      <div style={{ zIndex: 50 }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0" style={{ zIndex: 10 }}>
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onComplaintSelect={handleComplaintSelect}
        />
        
        {/* Main content with proper responsive padding */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-cream-50 to-cream-100" style={{ zIndex: 1 }}>
          <div className="h-full">
            <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 h-full">
              {/* Pass selected complaint to children if needed */}
              {React.cloneElement(children as React.ReactElement, { 
                selectedComplaint,
                onComplaintSelect: handleComplaintSelect 
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Complaint Detail Modal - High z-index but below search */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
          <div className="bg-cream-50 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedComplaint.title}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    selectedComplaint.priority === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                    selectedComplaint.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    selectedComplaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-green-100 text-green-800 border-green-200'
                  }`}>
                    {selectedComplaint.priority?.charAt(0).toUpperCase() + selectedComplaint.priority?.slice(1)} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                    selectedComplaint.status === 'in-progress' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    selectedComplaint.status === 'assigned' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {selectedComplaint.status?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
                        {selectedComplaint.sentiment?.charAt(0).toUpperCase() + selectedComplaint.sentiment?.slice(1)}
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

              <div className="flex justify-end pt-4 border-t border-gold-200">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
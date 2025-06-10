import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './pages/Dashboard';
import { Complaints } from './pages/Complaints';
import { Analytics } from './pages/Analytics';
import { Departments } from './pages/Departments';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { Search } from './pages/Search';
import { ErrorBoundary } from './components/ErrorBoundary';
import { isFirebaseInitialized } from './lib/firebase';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if Firebase is properly initialized
        if (!isFirebaseInitialized()) {
          throw new Error('Firebase initialization failed. Please check your configuration.');
        }
        
        console.log('✅ App initialization completed successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown initialization error');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (initializationError) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Initialization Failed
          </h1>
          <p className="text-gray-600 mb-4">
            {initializationError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-2 px-4 rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#fffdf7',
                color: '#1f2937',
                border: '1px solid #d4af37',
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
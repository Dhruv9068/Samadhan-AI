import React from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, TrendingUp, Clock, Users, FileText, Phone } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { SearchResults } from '../components/Search/SearchResults';

interface SearchPageProps {
  onComplaintSelect?: (complaint: any) => void;
}

export const Search: React.FC<SearchPageProps> = ({ onComplaintSelect }) => {
  const { searchQuery, searchResults, isSearching, setSearchQuery } = useSearch();

  const popularSearches = [
    'Street lights not working',
    'Water supply problem',
    'Traffic signal malfunction',
    'Garbage collection',
    'Road repair needed',
    'Hospital services',
    'School infrastructure',
    'Pollution complaint'
  ];

  const quickActions = [
    { title: 'File New Complaint', icon: FileText, color: 'gold', action: () => console.log('File complaint') },
    { title: 'Check Status', icon: Clock, color: 'blue', action: () => console.log('Check status') },
    { title: 'Contact Department', icon: Users, color: 'green', action: () => console.log('Contact dept') },
    { title: 'Emergency Services', icon: Phone, color: 'red', action: () => console.log('Emergency') }
  ];

  const handlePopularSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  const handleResultClick = (result: any) => {
    if (result.type === 'complaint' && result.complaint && onComplaintSelect) {
      onComplaintSelect(result.complaint);
    } else if (result.type === 'service' && result.url) {
      window.open(result.url, '_blank');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Search & Discover</h1>
        <p className="text-gold-600">Find complaints, departments, and government services in real-time</p>
      </motion.div>

      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SearchResults 
            results={searchResults}
            onResultClick={handleResultClick}
          />
        </motion.div>
      )}

      {!searchQuery && (
        <>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={action.action}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  action.color === 'gold' ? 'bg-gold-500' :
                  action.color === 'blue' ? 'bg-blue-500' :
                  action.color === 'green' ? 'bg-green-500' :
                  'bg-red-500'
                }`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{action.title}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cream-50 rounded-xl shadow-lg border border-gold-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gold-600" />
              Popular Searches
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularSearches.map((search, index) => (
                <motion.button
                  key={search}
                  className="text-left p-3 bg-white rounded-lg border border-gold-200 hover:border-gold-400 hover:shadow-md transition-all text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  onClick={() => handlePopularSearch(search)}
                >
                  <SearchIcon className="w-4 h-4 text-gold-600 mb-1" />
                  {search}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Search Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6"
          >
            <h3 className="text-lg font-bold text-blue-800 mb-4">Real-time Search Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">What you can search:</h4>
                <ul className="space-y-1">
                  <li>• Live complaint titles and descriptions</li>
                  <li>• Department names and services</li>
                  <li>• Government helpline numbers</li>
                  <li>• Emergency services and contacts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Search examples:</h4>
                <ul className="space-y-1">
                  <li>• "water supply" - Find water-related issues</li>
                  <li>• "traffic police" - Contact traffic department</li>
                  <li>• "emergency" - Find emergency services</li>
                  <li>• "1076" - CM Helpline information</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                🔍 <strong>Real-time Search:</strong> Results update automatically as new complaints are filed. 
                Click on any complaint to view full details instantly!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
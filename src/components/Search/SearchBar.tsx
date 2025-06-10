import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  FileText, 
  Users, 
  Phone, 
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader,
  Eye
} from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onComplaintSelect?: (complaint: any) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search complaints, departments, services...",
  className = "",
  onComplaintSelect
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    clearSearch,
    hasResults 
  } = useSearch();

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show results when there's a query and results
  useEffect(() => {
    setShowResults(isFocused && (hasResults || isSearching || searchQuery.length > 0));
  }, [isFocused, hasResults, isSearching, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    clearSearch();
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: any) => {
    if (result.type === 'complaint' && result.complaint && onComplaintSelect) {
      onComplaintSelect(result.complaint);
    } else if (result.type === 'service' && result.url) {
      window.open(result.url, '_blank');
    }
    setShowResults(false);
    setIsFocused(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return FileText;
      case 'department':
        return Users;
      case 'service':
        return Phone;
      default:
        return Search;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-gold-500' : ''
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Search className="h-4 w-4 text-gold-600" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 sm:py-3 bg-cream-100 border border-gold-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm sm:text-base text-gray-700 placeholder-gold-500 relative z-10"
        />
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gold-700 text-gold-500 transition-colors z-20"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gold-200 max-h-96 overflow-y-auto"
            style={{ zIndex: 9999 }} 
          >
            {isSearching && (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin text-gold-500" />
                  <span className="text-sm text-gray-600">Searching real-time...</span>
                </div>
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && (
              <div className="p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Search className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-500">Try searching for complaints, departments, or services</p>
                </div>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gold-200 bg-gold-50">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                {searchResults.map((result, index) => {
                  const Icon = getResultIcon(result.type);
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleResultClick(result)}
                      className="px-4 py-3 hover:bg-gold-50 cursor-pointer border-b border-gold-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="p-1.5 bg-gold-100 rounded-lg">
                            <Icon className="w-3 h-3 text-gold-600" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-800 truncate">
                              {result.title}
                            </h4>
                            <div className="flex items-center space-x-2 ml-2">
                              {result.type === 'complaint' && result.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(result.priority)}`}>
                                  {result.priority}
                                </span>
                              )}
                              {result.type === 'complaint' && (
                                <Eye className="w-3 h-3 text-gray-400" />
                              )}
                              {result.type === 'service' && (
                                <ExternalLink className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="capitalize font-medium">
                                {result.type.replace('-', ' ')}
                              </span>
                              
                              {result.department && (
                                <>
                                  <span>•</span>
                                  <span>{result.department}</span>
                                </>
                              )}
                              
                              {result.contact && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">{result.contact}</span>
                                </>
                              )}
                            </div>
                            
                            {result.type === 'complaint' && result.status && (
                              <div className="flex items-center space-x-1">
                                {result.status === 'resolved' && <CheckCircle className="w-3 h-3 text-green-600" />}
                                {result.status === 'pending' && <Clock className="w-3 h-3 text-orange-600" />}
                                {result.status === 'in-progress' && <AlertTriangle className="w-3 h-3 text-blue-600" />}
                                <span className={`text-xs font-medium ${getStatusColor(result.status)}`}>
                                  {result.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!isSearching && !searchQuery && (
              <div className="p-4">
                <div className="text-center">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Search across all data</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-blue-800 font-medium">Complaints</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <Users className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <p className="text-green-800 font-medium">Departments</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <Phone className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-purple-800 font-medium">Services</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
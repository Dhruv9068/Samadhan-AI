import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Phone, 
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Calendar
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'complaint' | 'department' | 'service';
  title: string;
  description: string;
  category?: string;
  priority?: string;
  status?: string;
  department?: string;
  contact?: string;
  url?: string;
  relevanceScore: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  onResultClick 
}) => {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return FileText;
      case 'department':
        return Users;
      case 'service':
        return Phone;
      default:
        return FileText;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'resolved':
        return CheckCircle;
      case 'in-progress':
        return AlertTriangle;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'service' && result.url) {
      window.open(result.url, '_blank');
    }
    onResultClick?.(result);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your search terms or browse by category</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Search Results ({results.length})
        </h3>
        <div className="text-sm text-gray-500">
          Sorted by relevance
        </div>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => {
          const Icon = getResultIcon(result.type);
          const StatusIcon = getStatusIcon(result.status);
          
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleResultClick(result)}
              className="bg-cream-50 rounded-xl shadow-md border border-gold-200 p-4 lg:p-6 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              whileHover={{ y: -2 }}
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 truncate">
                          {result.title}
                        </h4>
                        {result.type === 'service' && (
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {result.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {result.type.replace('-', ' ')}
                        </span>
                        
                        {result.category && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {result.category}
                          </span>
                        )}
                        
                        {result.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(result.priority)}`}>
                            {result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {result.status && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">
                        {result.status.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                  <div className="flex flex-wrap items-center gap-4">
                    {result.department && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{result.department}</span>
                      </div>
                    )}
                    
                    {result.contact && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span className="font-mono">{result.contact}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>Relevance: {Math.round(result.relevanceScore)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
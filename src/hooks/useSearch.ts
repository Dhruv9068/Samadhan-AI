import { useState, useEffect, useMemo } from 'react';
import { useRealTimeComplaints } from './useRealTimeComplaints';
import { Complaint } from '../types';

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
  complaint?: Complaint; // Add full complaint data
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { complaints } = useRealTimeComplaints();

  // Department data for search
  const departments = useMemo(() => [
    {
      id: 'public-works',
      name: 'Public Works',
      description: 'Infrastructure, roads, street lights, bridges, public buildings',
      contact: '0522-2237582',
      emergency: '1800-180-4334',
      services: ['Road Construction', 'Bridge Maintenance', 'Street Lights', 'Public Buildings', 'Drainage Systems']
    },
    {
      id: 'water-supply',
      name: 'Water Supply',
      description: 'Water distribution, quality, pipe repairs, new connections',
      contact: '0522-2623404',
      emergency: '1800-180-5555',
      services: ['Water Supply', 'Sewerage', 'Water Quality Testing', 'New Connections', 'Pipe Repairs']
    },
    {
      id: 'traffic-police',
      name: 'Traffic Police',
      description: 'Traffic management, violations, road safety, licensing',
      contact: '0522-2620173',
      emergency: '100',
      services: ['Traffic Management', 'Challan Services', 'License Verification', 'Road Safety']
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Pollution control, waste management, tree plantation',
      contact: '0522-2239296',
      emergency: '1800-180-4999',
      services: ['Pollution Control', 'Waste Management', 'Tree Plantation', 'Air Quality Monitoring']
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Public health services, hospital management, emergency care',
      contact: '0522-2237515',
      emergency: '108',
      services: ['Public Health Services', 'Hospital Management', 'Emergency Care', 'Vaccination Programs']
    },
    {
      id: 'education',
      name: 'Education',
      description: 'School management, teacher training, student welfare',
      contact: '0522-2237456',
      emergency: '1800-180-5678',
      services: ['School Management', 'Teacher Training', 'Student Welfare', 'Infrastructure Development']
    }
  ], []);

  // Government services for search
  const services = useMemo(() => [
    {
      id: 'cm-helpline',
      name: 'CM Helpline 1076',
      description: 'Direct complaints to Chief Minister office',
      url: 'tel:1076',
      category: 'Emergency'
    },
    {
      id: 'police-emergency',
      name: 'Police Emergency',
      description: 'Police emergency services and FIR registration',
      url: 'tel:100',
      category: 'Emergency'
    },
    {
      id: 'ambulance',
      name: 'Ambulance Service',
      description: 'Medical emergency and ambulance services',
      url: 'tel:108',
      category: 'Emergency'
    },
    {
      id: 'fire-service',
      name: 'Fire Service',
      description: 'Fire emergency and rescue services',
      url: 'tel:101',
      category: 'Emergency'
    },
    {
      id: 'women-helpline',
      name: 'Women Helpline',
      description: 'Women safety and support services',
      url: 'tel:1090',
      category: 'Support'
    },
    {
      id: 'anti-corruption',
      name: 'Anti-Corruption Helpline',
      description: 'Report corruption and malpractices',
      url: 'tel:1064',
      category: 'Governance'
    }
  ], []);

  // Calculate relevance score for search results
  const calculateRelevance = (text: string, query: string): number => {
    if (!query.trim()) return 0;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 0);
    
    let score = 0;
    
    // Exact match gets highest score
    if (lowerText.includes(lowerQuery)) {
      score += 100;
    }
    
    // Word matches
    queryWords.forEach(word => {
      if (lowerText.includes(word)) {
        score += 10;
      }
      
      // Partial word matches
      const words = lowerText.split(' ');
      words.forEach(textWord => {
        if (textWord.startsWith(word) || word.startsWith(textWord)) {
          score += 5;
        }
      });
    });
    
    // Boost score for title/name matches
    if (text.toLowerCase().includes('title') || text.toLowerCase().includes('name')) {
      score *= 1.5;
    }
    
    return score;
  };

  // Perform search across all data with real-time updates
  const performSearch = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];

    // Search complaints with full complaint data
    complaints.forEach(complaint => {
      const searchText = `${complaint.title} ${complaint.description} ${complaint.category} ${complaint.department} ${complaint.status} ${complaint.priority}`;
      const relevance = calculateRelevance(searchText, searchQuery);
      
      if (relevance > 0) {
        results.push({
          id: complaint.id,
          type: 'complaint',
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          priority: complaint.priority,
          status: complaint.status,
          department: complaint.department,
          relevanceScore: relevance,
          complaint: complaint // Include full complaint data
        });
      }
    });

    // Search departments
    departments.forEach(dept => {
      const searchText = `${dept.name} ${dept.description} ${dept.services.join(' ')}`;
      const relevance = calculateRelevance(searchText, searchQuery);
      
      if (relevance > 0) {
        results.push({
          id: dept.id,
          type: 'department',
          title: dept.name,
          description: dept.description,
          contact: dept.contact,
          department: dept.name,
          relevanceScore: relevance
        });
      }
    });

    // Search services
    services.forEach(service => {
      const searchText = `${service.name} ${service.description} ${service.category}`;
      const relevance = calculateRelevance(searchText, searchQuery);
      
      if (relevance > 0) {
        results.push({
          id: service.id,
          type: 'service',
          title: service.name,
          description: service.description,
          category: service.category,
          url: service.url,
          relevanceScore: relevance
        });
      }
    });

    // Sort by relevance score and limit results
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 15);
  }, [searchQuery, complaints, departments, services]);

  // Update search results with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const timeoutId = setTimeout(() => {
      setSearchResults(performSearch);
      setIsSearching(false);
    }, 200); // Reduced debounce time for faster response

    return () => clearTimeout(timeoutId);
  }, [performSearch, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    hasResults: searchResults.length > 0
  };
};
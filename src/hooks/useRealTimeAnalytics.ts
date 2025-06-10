import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';

interface AnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  categoryBreakdown: Array<{ name: string; value: number; color: string }>;
  departmentPerformance: Array<{ name: string; complaints: number; resolved: number; pending: number }>;
  monthlyTrends: Array<{ name: string; complaints: number; resolved: number }>;
  priorityDistribution: Array<{ priority: string; count: number }>;
  averageResponseTime: number;
  resolutionRate: number;
}

export const useRealTimeAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    categoryBreakdown: [],
    departmentPerformance: [],
    monthlyTrends: [],
    priorityDistribution: [],
    averageResponseTime: 0,
    resolutionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processAnalytics = (complaintsData: any[]) => {
    const total = complaintsData.length;
    const resolved = complaintsData.filter(c => c.status === 'resolved').length;
    const pending = complaintsData.filter(c => c.status === 'pending').length;
    const inProgress = complaintsData.filter(c => c.status === 'in-progress').length;

    // Category breakdown
    const categoryMap = new Map();
    const categoryColors = {
      'Infrastructure': '#d4af37',
      'Utilities': '#ff9933',
      'Environment': '#138808',
      'Traffic': '#000080',
      'Healthcare': '#8b4513',
      'Education': '#800080',
      'Other': '#666666',
    };

    complaintsData.forEach(complaint => {
      const category = complaint.category || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name as keyof typeof categoryColors] || '#666666',
    }));

    // Department performance
    const departmentMap = new Map();
    complaintsData.forEach(complaint => {
      const dept = complaint.department || 'General Services';
      if (!departmentMap.has(dept)) {
        departmentMap.set(dept, { complaints: 0, resolved: 0, pending: 0 });
      }
      const deptData = departmentMap.get(dept);
      deptData.complaints++;
      if (complaint.status === 'resolved') deptData.resolved++;
      if (complaint.status === 'pending') deptData.pending++;
    });

    const departmentPerformance = Array.from(departmentMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));

    // Monthly trends (last 12 months)
    const monthlyMap = new Map();
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyMap.set(monthKey, { complaints: 0, resolved: 0 });
    }

    complaintsData.forEach(complaint => {
      const submittedDate = complaint.createdAt?.toDate ? complaint.createdAt.toDate() : new Date(complaint.submitted_at);
      const monthKey = submittedDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyMap.has(monthKey)) {
        const monthData = monthlyMap.get(monthKey);
        monthData.complaints++;
        if (complaint.status === 'resolved') monthData.resolved++;
      }
    });

    const monthlyTrends = Array.from(monthlyMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));

    // Priority distribution
    const priorityMap = new Map();
    complaintsData.forEach(complaint => {
      const priority = complaint.priority || 'medium';
      priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
    });

    const priorityDistribution = Array.from(priorityMap.entries()).map(([priority, count]) => ({
      priority,
      count,
    }));

    // Calculate average response time and resolution rate
    const resolvedComplaints = complaintsData.filter(c => c.status === 'resolved' && c.resolved_at);
    let totalResponseTime = 0;
    
    resolvedComplaints.forEach(complaint => {
      const submitted = complaint.createdAt?.toDate ? complaint.createdAt.toDate() : new Date(complaint.submitted_at);
      const resolved = new Date(complaint.resolved_at);
      const responseTime = (resolved.getTime() - submitted.getTime()) / (1000 * 60 * 60); // hours
      totalResponseTime += responseTime;
    });

    const averageResponseTime = resolvedComplaints.length > 0 
      ? totalResponseTime / resolvedComplaints.length 
      : 0;

    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    setAnalytics({
      totalComplaints: total,
      resolvedComplaints: resolved,
      pendingComplaints: pending,
      inProgressComplaints: inProgress,
      categoryBreakdown,
      departmentPerformance,
      monthlyTrends,
      priorityDistribution,
      averageResponseTime,
      resolutionRate,
    });
  };

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!db) {
      setError('Firebase not properly configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const complaintsRef = collection(db, COLLECTIONS.COMPLAINTS);
      
      const unsubscribe = onSnapshot(
        complaintsRef,
        (snapshot) => {
          const complaintsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          processAnalytics(complaintsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching analytics:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up analytics listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const refetch = async () => {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      setLoading(true);
      const snapshot = await getDocs(collection(db, COLLECTIONS.COMPLAINTS));
      const complaintsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      processAnalytics(complaintsData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error refetching analytics:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return { analytics, loading, error, refetch };
};
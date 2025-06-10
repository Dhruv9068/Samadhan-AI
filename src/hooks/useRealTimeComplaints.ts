import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { Complaint } from '../types';

export const useRealTimeComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!db) {
      setError('Firebase not properly configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const complaintsRef = collection(db, COLLECTIONS.COMPLAINTS);
      const q = query(
        complaintsRef,
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const complaintsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              submitted_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as Complaint;
          });
          
          setComplaints(complaintsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching complaints:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Error setting up complaints listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.COMPLAINTS), {
        ...complaintData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { data: { id: docRef.id, ...complaintData }, error: null };
    } catch (err: any) {
      console.error('Error adding complaint:', err);
      return { data: null, error: err.message };
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = doc(db, COLLECTIONS.COMPLAINTS, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      return { data: { id, ...updates }, error: null };
    } catch (err: any) {
      console.error('Error updating complaint:', err);
      return { data: null, error: err.message };
    }
  };

  return {
    complaints,
    loading,
    error,
    addComplaint,
    updateComplaint,
  };
};
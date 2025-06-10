import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with proper types
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore with proper settings
  db = getFirestore(app);
  
  // Initialize Auth
  auth = getAuth(app);
  
  // Initialize Storage
  storage = getStorage(app);
  
  // Initialize Analytics only in browser environment and production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn('Analytics initialization failed:', analyticsError);
      analytics = null;
    }
  }
  
  console.log('🔥 Firebase initialized successfully for Samadhan AI');
  console.log('📊 Project ID:', firebaseConfig.projectId);
  console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
  
  // Test Firestore connection
  if (db) {
    console.log('✅ Firestore connected successfully');
  }
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  
  // Set to null on error
  app = null;
  db = null;
  auth = null;
  storage = null;
  analytics = null;
}

export { db, auth, storage, analytics };
export default app;

// Firestore collection references
export const COLLECTIONS = {
  COMPLAINTS: 'complaints',
  DEPARTMENTS: 'departments',
  CHAT_SESSIONS: 'chat_sessions',
  USERS: 'users',
  ANALYTICS: 'analytics',
} as const;

// Firebase Timestamp helper
export { serverTimestamp, Timestamp } from 'firebase/firestore';

// Database types for TypeScript
export interface FirebaseComplaint {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  department: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  watson_reply?: string;
  location?: string;
  contact_info?: string;
  assigned_to?: string;
  user_id?: string;
  resolved_at?: string;
  submitted_at: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

export interface FirebaseChatSession {
  id: string;
  user_id?: string;
  messages: any[];
  language: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

export interface FirebaseDepartment {
  id?: string;
  name: string;
  description: string;
  capacity: number;
  current_workload: number;
  average_response_time: number;
  head_name?: string;
  contact_email?: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

// Helper function to check if Firebase is properly initialized
export const isFirebaseInitialized = (): boolean => {
  return !!(app && db && auth);
};

// Helper function to get error-safe database reference
export const getSafeDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please check your configuration.');
  }
  return db;
};
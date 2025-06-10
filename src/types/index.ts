export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  department: string;
  submitted_at: string;
  assigned_to?: string | null;
  sentiment?: 'positive' | 'neutral' | 'negative' | null;
  watson_reply?: string | null;
  user_id?: string | null;
  location?: string | null;
  contact_info?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  capacity: number;
  current_workload: number;
  average_response_time: number;
  head_name?: string | null;
  contact_email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  activeUsers: number;
  queueSize: number;
  averageResponseTime: number;
  systemLoad: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

export interface ChatSession {
  id: string;
  user_id?: string | null;
  messages: ChatMessage[];
  language: string;
  created_at: string;
  updated_at: string;
}
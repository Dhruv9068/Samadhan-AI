import { db, COLLECTIONS, getSafeDb } from './firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

class LangChainRAG {
  private backendUrl: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    // All AI calls go through Flask backend now
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'https://samadhan-ai.vercel.app';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Samadhan AI';
    
    console.log('✅ LangChain configured to use Flask backend:', this.backendUrl);
  }

  async processComplaintWithRAG(
    complaintText: string,
    language: string = 'en'
  ): Promise<{
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    department: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestedResponse: string;
    timeline?: string;
    confidence?: number;
    source_documents?: any[];
  }> {
    try {
      console.log('🚀 Processing complaint with backend AI...');
      
      const response = await fetch(`${this.backendUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complaint: complaintText,
          language
        }),
      });

      console.log('📡 Backend AI Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Backend AI API error: ${response.status} ${response.statusText}`, errorText);
        return this.getFallbackAnalysis(complaintText);
      }

      const data = await response.json();
      console.log('📊 Backend AI Response:', data);
      
      if (data.error) {
        console.error('❌ Backend AI error:', data.error);
        return this.getFallbackAnalysis(complaintText);
      }

      console.log('✅ Successfully processed complaint with backend AI');
      
      return {
        category: data.category || 'Other',
        priority: data.priority || 'medium',
        department: data.department || 'General Services',
        sentiment: data.sentiment || 'neutral',
        suggestedResponse: data.ai_response || data.suggested_response || 'Thank you for your complaint. We will address it soon.',
        timeline: data.timeline || '3-5 business days',
        confidence: data.confidence || 0.8,
        source_documents: data.source_documents || []
      };
    } catch (error) {
      console.error('❌ Backend AI processing error:', error);
      return this.getFallbackAnalysis(complaintText);
    }
  }

  async generateSmartResponse(
    complaintText: string,
    category: string,
    language: string = 'en'
  ): Promise<string> {
    try {
      console.log('🤖 Generating smart response with backend AI...');
      
      const response = await fetch(`${this.backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: complaintText,
          language,
          context: { category }
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Backend smart response error: ${response.status}`);
        return this.getDefaultResponse(language);
      }

      const data = await response.json();
      
      if (data.error) {
        console.warn('⚠️ Backend smart response error:', data.error);
        return this.getDefaultResponse(language);
      }

      const aiResponse = data.response || this.getDefaultResponse(language);
      
      console.log('✅ Generated smart response via backend:', aiResponse);
      return aiResponse;
    } catch (error) {
      console.error('❌ Error generating smart response via backend:', error);
      return this.getDefaultResponse(language);
    }
  }

  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend connection...');
      
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend connection test successful:', data);
        return data.status === 'healthy';
      } else {
        const errorText = await response.text();
        console.error('❌ Backend connection test failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend connection test error:', error);
      return false;
    }
  }

  private getFallbackAnalysis(complaintText: string): {
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    department: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    suggestedResponse: string;
  } {
    const text = complaintText.toLowerCase();
    
    // Enhanced keyword-based categorization
    let category = 'Other';
    let department = 'General Services';
    
    // Infrastructure keywords
    if (text.includes('road') || text.includes('street') || text.includes('light') || 
        text.includes('bridge') || text.includes('footpath') || text.includes('pothole')) {
      category = 'Infrastructure';
      department = 'Public Works';
    }
    // Utilities keywords
    else if (text.includes('water') || text.includes('supply') || text.includes('pipe') || 
             text.includes('electricity') || text.includes('power') || text.includes('gas')) {
      category = 'Utilities';
      department = 'Water Supply';
    }
    // Traffic keywords
    else if (text.includes('traffic') || text.includes('signal') || text.includes('parking') || 
             text.includes('vehicle') || text.includes('accident') || text.includes('speed')) {
      category = 'Traffic';
      department = 'Traffic Police';
    }
    // Environment keywords
    else if (text.includes('garbage') || text.includes('pollution') || text.includes('environment') || 
             text.includes('waste') || text.includes('noise') || text.includes('air')) {
      category = 'Environment';
      department = 'Environment';
    }
    // Healthcare keywords
    else if (text.includes('health') || text.includes('hospital') || text.includes('medical') || 
             text.includes('doctor') || text.includes('medicine') || text.includes('clinic')) {
      category = 'Healthcare';
      department = 'Healthcare';
    }
    // Education keywords
    else if (text.includes('school') || text.includes('education') || text.includes('teacher') || 
             text.includes('student') || text.includes('college') || text.includes('university')) {
      category = 'Education';
      department = 'Education';
    }

    // Enhanced priority detection
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (text.includes('urgent') || text.includes('emergency') || text.includes('critical') || 
        text.includes('immediate') || text.includes('danger') || text.includes('life')) {
      priority = 'critical';
    } else if (text.includes('important') || text.includes('serious') || text.includes('major') || 
               text.includes('significant') || text.includes('severe')) {
      priority = 'high';
    } else if (text.includes('minor') || text.includes('small') || text.includes('little') || 
               text.includes('slight')) {
      priority = 'low';
    }

    // Enhanced sentiment analysis
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    const negativeWords = ['angry', 'frustrated', 'terrible', 'worst', 'horrible', 'disgusted', 'furious', 'outraged'];
    const positiveWords = ['thank', 'appreciate', 'good', 'excellent', 'satisfied', 'happy', 'pleased'];
    
    const hasNegative = negativeWords.some(word => text.includes(word));
    const hasPositive = positiveWords.some(word => text.includes(word));
    
    if (hasNegative && !hasPositive) {
      sentiment = 'negative';
    } else if (hasPositive && !hasNegative) {
      sentiment = 'positive';
    }

    return {
      category,
      priority,
      department,
      sentiment,
      suggestedResponse: 'Thank you for your complaint. We have received it and will process it accordingly. Our team will review your issue and take appropriate action.',
    };
  }

  private getDefaultResponse(language: string): string {
    const responses: Record<string, string> = {
      'en': 'Thank you for your complaint. We have received it and will address it promptly.',
      'hi': 'आपकी शिकायत के लिए धन्यवाद। हमें यह प्राप्त हो गई है और हम इसे तुरंत संबोधित करेंगे।',
      'bn': 'আপনার অভিযোগের জন্য ধন্যবাদ। আমরা এটি পেয়েছি এবং দ্রুত সমাধান করব।',
      'ta': 'உங்கள் புகாருக்கு நன்றி। நாங்கள் இதைப் பெற்றுள்ளோம் மற்றும் உடனடியாக தீர்வு காண்போம்।',
      'te': 'మీ ఫిర్యాదుకు ధన్యవాదాలు। మేము దీనిని స్వీకరించాము మరియు వెంటనే పరిష్కరిస్తాము।',
      'mr': 'तुमच्या तक्रारीबद्दल धन्यवाद. आम्हाला ती मिळाली आहे आणि आम्ही लवकरच त्यावर कारवाई करू.',
    };

    const langCode = language.split('-')[0];
    return responses[langCode] || responses['en'];
  }

  // Method to analyze complaint trends (using Firebase data)
  async analyzeComplaintTrends(): Promise<{
    topCategories: Array<{ category: string; count: number }>;
    urgentIssues: Array<{ title: string; priority: string }>;
    departmentLoad: Array<{ department: string; count: number }>;
  }> {
    try {
      const safeDb = getSafeDb();
      const complaintsRef = collection(safeDb, COLLECTIONS.COMPLAINTS);
      const snapshot = await getDocs(complaintsRef);
      
      const complaints = snapshot.docs.map(doc => doc.data());
      
      // Analyze categories
      const categoryMap = new Map();
      const departmentMap = new Map();
      const urgentIssues: Array<{ title: string; priority: string }> = [];
      
      complaints.forEach(complaint => {
        // Count categories
        const category = complaint.category || 'Other';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        
        // Count departments
        const department = complaint.department || 'General Services';
        departmentMap.set(department, (departmentMap.get(department) || 0) + 1);
        
        // Collect urgent issues
        if (complaint.priority === 'critical' || complaint.priority === 'high') {
          urgentIssues.push({
            title: complaint.title,
            priority: complaint.priority
          });
        }
      });
      
      return {
        topCategories: Array.from(categoryMap.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        urgentIssues: urgentIssues.slice(0, 10),
        departmentLoad: Array.from(departmentMap.entries())
          .map(([department, count]) => ({ department, count }))
          .sort((a, b) => b.count - a.count)
      };
    } catch (error) {
      console.error('❌ Error analyzing complaint trends:', error);
      return {
        topCategories: [],
        urgentIssues: [],
        departmentLoad: []
      };
    }
  }
}

export const langchainRAG = new LangChainRAG();
// Simplified Watson client that only calls backend
class WatsonXAssistant {
  private backendUrl: string;

  constructor() {
    // All AI calls go through Flask backend now
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    console.log('✅ Watson client configured to use Flask backend:', this.backendUrl);
  }

  async sendMessage(message: string, language: string = 'en'): Promise<string> {
    try {
      console.log('🤖 Sending message to backend AI:', message.substring(0, 100) + '...');

      const response = await fetch(`${this.backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend AI error:', response.status, errorData);
        return this.getFallbackResponse(message, language);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Backend AI error:', data.error);
        return this.getFallbackResponse(message, language);
      }

      const aiResponse = data.response;
      
      if (!aiResponse) {
        console.warn('⚠️ No response from backend AI');
        return this.getFallbackResponse(message, language);
      }

      console.log('✅ Backend AI response received');
      return aiResponse;
      
    } catch (error) {
      console.error('❌ Backend AI communication error:', error);
      return this.getFallbackResponse(message, language);
    }
  }

  async generateComplaintResponse(
    complaintText: string,
    category: string,
    priority: string,
    language: string = 'en'
  ): Promise<string> {
    try {
      console.log('🔍 Generating complaint response via backend...');
      
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend complaint analysis error:', response.status, errorData);
        return this.getCategorySpecificResponse(complaintText, category, priority, language);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Backend complaint analysis error:', data.error);
        return this.getCategorySpecificResponse(complaintText, category, priority, language);
      }

      const aiResponse = data.ai_response;
      
      if (!aiResponse) {
        console.warn('⚠️ No AI response from backend');
        return this.getCategorySpecificResponse(complaintText, category, priority, language);
      }

      console.log('✅ Complaint response generated via backend');
      return aiResponse;
      
    } catch (error) {
      console.error('❌ Backend complaint analysis error:', error);
      return this.getCategorySpecificResponse(complaintText, category, priority, language);
    }
  }

  private getCategorySpecificResponse(
    complaintText: string,
    category: string,
    priority: string,
    language: string
  ): string {
    const responses: Record<string, Record<string, string[]>> = {
      'Infrastructure': {
        'en': [
          "Thank you for reporting this infrastructure issue. We've forwarded your complaint to the Public Works Department. Expected resolution time: 3-5 business days.",
          "Your infrastructure concern has been logged with high priority. Our engineering team will assess the situation and provide an update within 48 hours.",
          "We acknowledge your infrastructure complaint. The relevant authorities have been notified and will investigate this matter promptly."
        ],
        'hi': [
          "इस बुनियादी ढांचे की समस्या की रिपोर्ट करने के लिए धन्यवाद। हमने आपकी शिकायत लोक निर्माण विभाग को भेज दी है। अपेक्षित समाधान समय: 3-5 कार्य दिवस।",
          "आपकी बुनियादी ढांचे की चिंता उच्च प्राथमिकता के साथ दर्ज की गई है। हमारी इंजीनियरिंग टीम स्थिति का आकलन करेगी।"
        ]
      },
      'Utilities': {
        'en': [
          "Your utility service complaint has been received. The Water Supply Department will investigate and resolve this issue within 24-48 hours.",
          "Thank you for reporting this utility issue. Our technical team is aware and will address this matter urgently.",
          "We've logged your utility complaint. Emergency repairs will be prioritized if this affects essential services."
        ],
        'hi': [
          "आपकी उपयोगिता सेवा की शिकायत प्राप्त हुई है। जल आपूर्ति विभाग 24-48 घंटों के भीतर इस समस्या की जांच और समाधान करेगा।"
        ]
      },
      'Traffic': {
        'en': [
          "Your traffic-related complaint has been forwarded to the Traffic Police Department. They will investigate and take appropriate action within 24 hours.",
          "Thank you for reporting this traffic issue. Our traffic management team will review and implement necessary measures.",
          "We've received your traffic complaint. Safety measures will be evaluated and implemented as needed."
        ]
      },
      'Environment': {
        'en': [
          "Your environmental concern has been logged with the Environment Department. An inspection will be conducted within 2-3 business days.",
          "Thank you for reporting this environmental issue. Our environmental team will assess and take corrective action.",
          "We acknowledge your environmental complaint. Pollution control measures will be reviewed and implemented."
        ]
      },
      'Healthcare': {
        'en': [
          "Your healthcare complaint has been forwarded to the Healthcare Department. A medical officer will review this matter within 24 hours.",
          "Thank you for bringing this healthcare issue to our attention. Quality assurance measures will be implemented.",
          "We've received your healthcare concern. Patient safety and service quality are our top priorities."
        ]
      },
      'Education': {
        'en': [
          "Your education-related complaint has been sent to the Education Department. An educational officer will investigate within 2-3 days.",
          "Thank you for reporting this educational issue. Academic standards and facilities will be reviewed.",
          "We acknowledge your education complaint. Student welfare and educational quality are paramount."
        ]
      }
    };

    const categoryResponses = responses[category] || responses['Infrastructure'];
    const languageResponses = categoryResponses[language] || categoryResponses['en'];
    const randomResponse = languageResponses[Math.floor(Math.random() * languageResponses.length)];

    // Add priority-based urgency
    if (priority === 'critical') {
      return `🚨 URGENT: ${randomResponse} This has been marked as critical priority and will receive immediate attention.`;
    } else if (priority === 'high') {
      return `⚡ HIGH PRIORITY: ${randomResponse} This will be expedited for faster resolution.`;
    }

    return randomResponse;
  }

  private getFallbackResponse(message: string, language: string): string {
    const responses: Record<string, string[]> = {
      'en': [
        "Thank you for contacting Samadhan AI. I understand your concern and have logged your complaint. Our team will review it and respond within 24-48 hours.",
        "I appreciate you bringing this matter to our attention. Your complaint has been received and will be assigned to the appropriate department for prompt action.",
        "Thank you for your message. I've recorded your concern and it will be processed according to our standard procedures. You can expect an update soon.",
        "Your complaint has been successfully logged in our system. Our dedicated team will investigate this matter and provide you with a resolution timeline shortly.",
        "I acknowledge your concern and have forwarded it to the relevant authorities. We take all citizen complaints seriously and will ensure proper action is taken.",
      ],
      'hi': [
        "समाधान AI से संपर्क करने के लिए धन्यवाद। मैं आपकी चिंता समझता हूं और आपकी शिकायत दर्ज कर ली है। हमारी टीम इसकी समीक्षा करेगी और 24-48 घंटों में जवाब देगी।",
        "इस मामले को हमारे ध्यान में लाने के लिए धन्यवाद। आपकी शिकायत प्राप्त हो गई है और तुरंत कार्रवाई के लिए उपयुक्त विभाग को सौंपी जाएगी।",
        "आपके संदेश के लिए धन्यवाद। मैंने आपकी चिंता दर्ज कर ली है और इसे हमारी मानक प्रक्रियाओं के अनुसार संसाधित किया जाएगा।",
      ],
      'bn': [
        "সমাধান AI-এর সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমি আপনার উদ্বেগ বুঝতে পারছি এবং আপনার অভিযোগ লগ করেছি। আমাদের দল এটি পর্যালোচনা করবে এবং ২৪-৪৮ ঘন্টার মধ্যে উত্তর দেবে।",
        "এই বিষয়টি আমাদের নজরে আনার জন্য ধন্যবাদ। আপনার অভিযোগ পাওয়া গেছে এবং দ্রুত পদক্ষেপের জন্য উপযুক্ত বিভাগে পাঠানো হবে।",
      ],
      'ta': [
        "சமாதான் AI-ஐ தொடர்பு கொண்டதற்கு நன்றி। உங்கள் கவலையை நான் புரிந்துகொள்கிறேன் மற்றும் உங்கள் புகாரை பதிவு செய்துள்ளேன். எங்கள் குழு இதை மதிப்பாய்வு செய்து 24-48 மணி நேரத்தில் பதிலளிக்கும்।",
      ],
      'te': [
        "సమాధాన్ AI ని సంప్రదించినందుకు ధన్యవాదాలు. మీ ఆందోళనను నేను అర్థం చేసుకున్నాను మరియు మీ ఫిర్యాదును లాగ్ చేసాను. మా బృందం దీనిని సమీక్షించి 24-48 గంటల్లో ప్రతిస్పందిస్తుంది।",
      ],
      'mr': [
        "समाधान AI शी संपर्क साधल्याबद्दल धन्यवाद. मला तुमची चिंता समजली आहे आणि तुमची तक्रार नोंदवली आहे. आमची टीम याचे पुनरावलोकन करेल आणि 24-48 तासांत प्रतिसाद देईल.",
      ],
    };

    const langCode = language.split('-')[0];
    const langResponses = responses[langCode] || responses['en'];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  }

  // Method to check backend health
  async checkServiceHealth(): Promise<boolean> {
    try {
      console.log('🔍 Checking backend health...');
      
      const response = await fetch(`${this.backendUrl}/health`);
      
      if (!response.ok) {
        console.error('❌ Backend health check failed:', response.status);
        return false;
      }

      const healthData = await response.json();
      console.log('📊 Backend health check:', healthData);
      
      return healthData.status === 'healthy';
    } catch (error) {
      console.error('❌ Backend health check error:', error);
      return false;
    }
  }

  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing backend connection...');
      
      const response = await fetch(`${this.backendUrl}/api/watsonx/test`);
      
      if (!response.ok) {
        console.error('❌ Backend test failed:', response.status);
        return false;
      }

      const testData = await response.json();
      
      if (testData.error) {
        console.error('❌ Backend test error:', testData.error);
        return false;
      }

      console.log('✅ Backend test successful:', testData);
      return testData.success !== false;
    } catch (error) {
      console.error('❌ Backend test error:', error);
      return false;
    }
  }

  // Get deployment info
  async getDeploymentInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      
      if (!response.ok) {
        return null;
      }

      const healthData = await response.json();
      
      return {
        metadata: {
          id: 'backend-ai',
          name: 'Centralized AI Backend',
          status: 'active',
          region: 'local',
          model: 'watson-x + openrouter-deepseek'
        },
        model: 'hybrid-ai',
        capabilities: ['text-generation', 'conversation', 'sentiment-analysis', 'complaint-analysis'],
        endpoint: this.backendUrl,
        version: '1.0.0',
        backend: this.backendUrl
      };
    } catch (error) {
      console.error('❌ Error getting deployment info:', error);
      return null;
    }
  }
}

export const watsonAssistant = new WatsonXAssistant();
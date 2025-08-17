import { GoogleGenerativeAI } from '@google/generative-ai';

// Samadhan AI system prompt for UP CM Helpline 1076
const SAMADHAN_SYSTEM_PROMPT = `You are Samadhan AI, an intelligent AI assistant for the UP CM Helpline 1076. Your role is to help citizens with their complaints and queries about government services in Uttar Pradesh.

**IMPORTANT RULES:**
1. **Always respond as "Samadhan AI"** - never break character
2. **Keep responses short and concise** (1-2 sentences maximum)
3. **Be helpful and empathetic** - citizens are often frustrated
4. **Provide relevant information** about government departments and services
5. **Suggest next steps** when possible
6. **Respond in the user's language** if they use Hindi or other regional languages
7. **NO markdown formatting** - use plain text only
8. **NO bold or special characters** - just clean, simple text

**Your capabilities:**
- Handle complaints about government services
- Provide information about departments
- Guide users through complaint processes
- Offer relevant contact information
- Explain government schemes and services

**Response format:**
- Start with "Samadhan AI:" 
- Provide clear, actionable information in 1-2 sentences
- End with a helpful suggestion or next step
- Use simple language without formatting

**Example response:**
Samadhan AI: I understand your concern about [issue]. Here's what I can help you with: [specific information or solution]. Would you like me to help you file a formal complaint or need more information about [specific service]?

Remember: You are here to make government services more accessible and help citizens get their issues resolved efficiently. Keep responses short, helpful, and easy to understand.`;

export interface AIResponse {
  response: string;
  analysis: {
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    department: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    isComplaint: boolean;
  };
}

export class GeminiAIService {
  private model: any = null;
  private isInitialized: boolean = false;

  private initialize() {
    if (this.isInitialized) return;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error('❌ Gemini AI API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
        throw new Error('Gemini AI API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
      console.log('✅ Gemini AI initialized successfully');
    } catch (error) {
      console.error('❌ Gemini AI initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  async generateResponse(message: string, language: string = 'en'): Promise<AIResponse> {
    try {
      // Initialize if not already done
      if (!this.isInitialized) {
        this.initialize();
      }

      if (!this.model) {
        throw new Error('Gemini AI model not available');
      }

      // Detect if message is in Hindi or other regional languages
      const isHindi = /[\u0900-\u097F]/.test(message);
      const isBengali = /[\u0980-\u09FF]/.test(message);
      const isTamil = /[\u0B80-\u0BFF]/.test(message);
      const isTelugu = /[\u0C00-\u0C7F]/.test(message);
      const isMarathi = /[\u0900-\u097F]/.test(message);
      const isGujarati = /[\u0A80-\u0AFF]/.test(message);
      const isKannada = /[\u0C80-\u0CFF]/.test(message);
      const isMalayalam = /[\u0D00-\u0D7F]/.test(message);
      const isPunjabi = /[\u0A00-\u0A7F]/.test(message);

      let detectedLanguage = 'en';
      if (isHindi || isMarathi) detectedLanguage = 'hi';
      else if (isBengali) detectedLanguage = 'bn';
      else if (isTamil) detectedLanguage = 'ta';
      else if (isTelugu) detectedLanguage = 'te';
      else if (isGujarati) detectedLanguage = 'gu';
      else if (isKannada) detectedLanguage = 'kn';
      else if (isMalayalam) detectedLanguage = 'ml';
      else if (isPunjabi) detectedLanguage = 'pa';

      // Create language-specific prompt
      const languagePrompt = this.getLanguagePrompt(detectedLanguage);
      
      const fullPrompt = `${SAMADHAN_SYSTEM_PROMPT}

${languagePrompt}

**User Message:** ${message}

**Instructions:** 
1. Analyze if this is a complaint or general query
2. Provide a helpful response in ${detectedLanguage === 'en' ? 'English' : 'the same language as the user'}
3. If it's a complaint, categorize it and suggest relevant department
4. Keep response concise and actionable

**Response:**`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response.text();

      // Analyze the message for complaint categorization
      const analysis = this.analyzeMessage(message);

      return {
        response: response.trim(),
        analysis
      };

    } catch (error) {
      console.error('❌ Gemini AI error:', error);
      
      // Fallback response
      const fallbackResponse = this.getFallbackResponse(language);
      return {
        response: fallbackResponse,
        analysis: {
          category: 'General',
          priority: 'low',
          department: 'General',
          sentiment: 'neutral',
          isComplaint: false
        }
      };
    }
  }

  private getLanguagePrompt(language: string): string {
    const prompts: { [key: string]: string } = {
      'hi': '**भाषा निर्देश:** उपयोगकर्ता को हिंदी में जवाब दें। सरकारी सेवाओं के बारे में स्पष्ट और सहायक जानकारी प्रदान करें।',
      'bn': '**ভাষা নির্দেশ:** ব্যবহারকারীকে বাংলায় উত্তর দিন। সরকারি পরিষেবা সম্পর্কে স্পষ্ট এবং সহায়ক তথ্য প্রদান করুন।',
      'ta': '**மொழி வழிகாட்டுதல்:** பயனருக்கு தமிழில் பதிலளிக்கவும். அரசு சேவைகள் பற்றி தெளிவான மற்றும் உதவிகரமான தகவல்களை வழங்கவும்.',
      'te': '**భాషా మార్గదర్శకం:** వినియోగదారుకు తెలుగులో సమాధానం ఇవ్వండి. ప్రభుత్వ సేవల గురించి స్పష్టమైన మరియు సహాయకమైన సమాచారాన్ని అందించండి.',
      'mr': '**भाषा सूचना:** वापरकर्त्याला मराठीत उत्तर द्या. सरकारी सेवांबद्दल स्पष्ट आणि सहाय्यक माहिती द्या.',
      'gu': '**ભાષા માર્ગદર્શન:** વપરાશકર્તાને ગુજરાતીમાં જવાબ આપો. સરકારી સેવાઓ વિશે સ્પષ્ટ અને સહાયક માહિતી આપો.',
      'kn': '**ಭಾಷಾ ಮಾರ್ಗದರ್ಶನ:** ಬಳಕೆದಾರರಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಬಗ್ಗೆ ಸ್ಪಷ್ಟ ಮತ್ತು ಸಹಾಯಕ ಮಾಹಿತಿಯನ್ನು ನೀಡಿ.',
      'ml': '**ഭാഷാ മാർഗ്ഗനിർദ്ദേശം:** ഉപയോക്താവിന് മലയാളത്തിൽ ഉത്തരം നൽകുക. സർക്കാർ സേവനങ്ങളെക്കുറിച്ച് വ്യക്തവും സഹായകരവുമായ വിവരങ്ങൾ നൽകുക.',
      'pa': '**ਭਾਸ਼ਾ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:** ਉਪਭੋਗਤਾ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਬਾਰੇ ਸਪਸ਼ਟ ਅਤੇ ਸਹਾਇਕ ਜਾਣਕਾਰੀ ਦਿਓ।',
      'en': '**Language Instructions:** Respond to the user in English. Provide clear and helpful information about government services.'
    };

    return prompts[language] || prompts['en'];
  }

  private analyzeMessage(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Detect complaint keywords
    const complaintKeywords = [
      'complaint', 'problem', 'issue', 'grievance', 'shikayat', 'समस्या', 'शिकायत', 'problem',
      'broken', 'not working', 'damaged', 'corruption', 'delay', 'late', 'missing'
    ];

    const isComplaint = complaintKeywords.some(keyword => lowerMessage.includes(keyword));

    // Categorize complaints
    let category = 'General';
    let department = 'General';
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (lowerMessage.includes('water') || lowerMessage.includes('पानी') || lowerMessage.includes('জল')) {
      category = 'Water Supply';
      department = 'Jal Nigam';
      priority = 'high';
    } else if (lowerMessage.includes('electricity') || lowerMessage.includes('बिजली') || lowerMessage.includes('বিদ্যুৎ')) {
      category = 'Electricity';
      department = 'Power Corporation';
      priority = 'high';
    } else if (lowerMessage.includes('road') || lowerMessage.includes('सड़क') || lowerMessage.includes('রাস্তা')) {
      category = 'Roads & Infrastructure';
      department = 'Public Works Department';
      priority = 'medium';
    } else if (lowerMessage.includes('health') || lowerMessage.includes('स्वास्थ्य') || lowerMessage.includes('স্বাস্থ্য')) {
      category = 'Healthcare';
      department = 'Health Department';
      priority = 'critical';
    } else if (lowerMessage.includes('education') || lowerMessage.includes('शिक्षा') || lowerMessage.includes('শিক্ষা')) {
      category = 'Education';
      department = 'Education Department';
      priority = 'medium';
    } else if (lowerMessage.includes('police') || lowerMessage.includes('पुलिस') || lowerMessage.includes('পুলিশ')) {
      category = 'Law & Order';
      department = 'Police Department';
      priority = 'high';
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('परिवहन') || lowerMessage.includes('পরিবহন')) {
      category = 'Transport';
      department = 'Transport Department';
      priority = 'medium';
    }

    // Detect sentiment
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'बुरा', 'खराब', 'ভালো নয়'];
    const positiveWords = ['good', 'great', 'excellent', 'wonderful', 'अच्छा', 'बढ़िया', 'চমৎকার'];
    
    if (negativeWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'negative';
    } else if (positiveWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'positive';
    }

    return {
      category,
      priority,
      department,
      sentiment,
      isComplaint
    };
  }

  private getFallbackResponse(language: string): string {
    const fallbacks: { [key: string]: string } = {
      'hi': 'Samadhan AI: माफ़ करें, मुझे आपकी जानकारी प्रोसेस करने में समस्या आ रही है। कृपया कुछ देर बाद फिर से कोशिश करें।',
      'bn': 'Samadhan AI: দুঃখিত, আপনার তথ্য প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।',
      'ta': 'Samadhan AI: மன்னிக்கவும், உங்கள் தகவலை செயலாக்குவதில் சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.',
      'te': 'Samadhan AI: క్షమించండి, మీ సమాచారాన్ని ప్రాసెస్ చేయడంలో సమస్య ఉంది. దయచేసి కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి.',
      'mr': 'Samadhan AI: माफ करा, तुमची माहिती प्रक्रिया करण्यात समस्या येत आहे. कृपया थोडा वेळ थांबून पुन्हा प्रयत्न करा.',
      'gu': 'Samadhan AI: માફ કરો, તમારી માહિતી પ્રક્રિયા કરવામાં સમસ્યા આવી રહી છે. કૃપા કરીને થોડો સમય રાહ જુઓ અને ફરીથી પ્રયાસ કરો.',
      'kn': '**Samadhan AI:** ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಲ್ಲಿ ಸಮಸ್ಯೆ ಇದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯ ನಿರೀಕ്ಷಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿಭಿನ್ನ ರೀತಿಯಲ್ಲಿ ವಿವರಿಸಿ.',
      'ml': '**Samadhan AI:** ക്ഷമിക്കണം, നിങ്ങളുടെ വിവരങ്ങൾ പ്രോസസ്സ് ചെയ്യുന്നതിൽ പ്രശ്നമുണ്ട്. ദയവായി കുറച്ച് സമയം കാത്തിരിക്കുക, പിന്നീട് വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ പ്രശ്നം വ്യത്യസ്തമായി വിവരിക്കുക.',
      'pa': '**Samadhan AI:** ਮਾਫ਼ ਕਰੋ, ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਮਾਂ ਉਡੀਕ ਕਰੋ ਅਤੇ ਫਿਰ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਆਪਣੀ ਸਮੱਸਿਆ ਨੂੰ ਵੱਖਰੇ ਤਰੀਕੇ ਨਾਲ ਦੱਸੋ।',
      'en': '**Samadhan AI:** I apologize, but I\'m experiencing difficulty processing your information. Please try again in a moment or describe your issue in a different way.'
    };

    return fallbacks[language] || fallbacks['en'];
  }

  // Method to check if the service is properly configured
  isConfigured(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  // Method to get configuration status
  getStatus(): 'configured' | 'not-configured' | 'error' {
    if (!this.isConfigured()) return 'not-configured';
    if (this.isInitialized) return 'configured';
    return 'error';
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService();

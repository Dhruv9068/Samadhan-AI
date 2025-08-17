// Browser-compatible ElevenLabs service using fetch API

// Voice IDs for different languages and personalities
const VOICE_IDS = {
  // English voices
  'en-US': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Professional, friendly
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear, helpful
  },
  // Hindi voices
  'hi-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Works well with Hindi
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear pronunciation
  },
  // Bengali voices
  'bn-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Good for Bengali
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear speech
  },
  // Tamil voices
  'ta-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Works with Tamil
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear pronunciation
  },
  // Telugu voices
  'te-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Good for Telugu
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear speech
  },
  // Marathi voices
  'mr-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Works with Marathi
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear pronunciation
  },
  // Gujarati voices
  'gu-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Good for Gujarati
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear speech
  },
  // Kannada voices
  'kn-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Works with Kannada
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear pronunciation
  },
  // Malayalam voices
  'ml-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Good for Malayalam
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear speech
  },
  // Punjabi voices
  'pa-IN': {
    'samadhan': '21m00Tcm4TlvDq8ikWAM', // Rachel - Works with Punjabi
    'assistant': 'AZnzlk1XvdvUeBnXmlld', // Domi - Clear pronunciation
  },
};

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: {
    stability: number;
    similarityBoost: number;
    style: number;
    useSpeakerBoost: boolean;
  };
}

export class ElevenLabsService {
  private isInitialized: boolean = false;
  private currentVoiceId: string = VOICE_IDS['en-US'].samadhan;
  private apiKey: string | null = null;

  constructor() {
    // Don't initialize immediately - wait for first use
  }

  private async initialize() {
    if (this.isInitialized) return;

    try {
      this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      
      if (!this.apiKey) {
        console.warn('⚠️ ElevenLabs API key not found. Voice features will use fallback.');
        this.isInitialized = false;
        return;
      }

      this.isInitialized = true;
      console.log('✅ ElevenLabs initialized successfully');
    } catch (error) {
      console.warn('⚠️ ElevenLabs initialization failed, using fallback:', error);
      this.isInitialized = false;
    }
  }

  // Set voice based on language
  setVoice(language: string, voiceType: 'samadhan' | 'assistant' = 'samadhan') {
    const langCode = language.split('-')[0];
    const voices = VOICE_IDS[langCode as keyof typeof VOICE_IDS] || VOICE_IDS['en-US'];
    this.currentVoiceId = voices[voiceType];
    console.log(`🎤 Voice set to: ${voiceType} for language: ${language}`);
  }

  // Text-to-Speech with ElevenLabs using fetch API
  async textToSpeech(text: string, language: string = 'en-US'): Promise<ArrayBuffer | null> {
    try {
      // Initialize if not already done
      await this.initialize();

      if (!this.isInitialized || !this.apiKey) {
        console.log('🎤 ElevenLabs not available, using fallback');
        return null; // Signal to use fallback
      }

      // Set appropriate voice for the language
      this.setVoice(language);

      // Clean the text (remove any markdown or special characters)
      const cleanText = text
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '')   // Remove italic markers
        .replace(/^Samadhan AI:\s*/i, '') // Remove "Samadhan AI:" prefix
        .trim();

      console.log('🎤 ElevenLabs TTS:', { text: cleanText, voiceId: this.currentVoiceId });

      // Use ElevenLabs REST API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.currentVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return audioBuffer;
    } catch (error) {
      console.warn('⚠️ ElevenLabs TTS error, using fallback:', error);
      return null; // Signal to use fallback
    }
  }

  // Speech-to-Speech (Voice Cloning) - for future use
  async speechToSpeech(audioBlob: Blob, targetText: string, language: string = 'en-US'): Promise<ArrayBuffer | null> {
    try {
      // Initialize if not already done
      await this.initialize();

      if (!this.isInitialized || !this.apiKey) {
        console.log('🎤 ElevenLabs STS not available');
        return null;
      }

      // Set appropriate voice for the language
      this.setVoice(language);

      console.log('🎤 ElevenLabs STS:', { targetText, voiceId: this.currentVoiceId });

      // Convert blob to buffer
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Use ElevenLabs REST API for speech-to-speech
      const formData = new FormData();
      formData.append('audio', new Blob([arrayBuffer], { type: 'audio/wav' }));
      formData.append('text', targetText);
      formData.append('model_id', 'eleven_multilingual_v2');
      formData.append('voice_settings', JSON.stringify({
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      }));

      const response = await fetch(`https://api.elevenlabs.io/v1/speech-to-speech/${this.currentVoiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs STS API error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return audioBuffer;
    } catch (error) {
      console.warn('⚠️ ElevenLabs STS error:', error);
      return null;
    }
  }

  // Get available voices
  async getVoices() {
    try {
      await this.initialize();
      
      if (!this.isInitialized || !this.apiKey) {
        return [];
      }

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs voices API error: ${response.status}`);
      }

      const voices = await response.json();
      return voices.voices || [];
    } catch (error) {
      console.warn('⚠️ Error fetching voices:', error);
      return [];
    }
  }

  // Check if service is properly configured
  isConfigured(): boolean {
    return !!import.meta.env.VITE_ELEVENLABS_API_KEY;
  }

  // Get configuration status
  getStatus(): 'configured' | 'not-configured' | 'error' {
    if (!this.isConfigured()) return 'not-configured';
    if (this.isInitialized) return 'configured';
    return 'error';
  }

  // Get current voice ID
  getCurrentVoiceId(): string {
    return this.currentVoiceId;
  }

  // Get voice info for current language
  getVoiceInfo(language: string) {
    const langCode = language.split('-')[0];
    const voices = VOICE_IDS[langCode as keyof typeof VOICE_IDS] || VOICE_IDS['en-US'];
    return {
      samadhan: voices.samadhan,
      assistant: voices.assistant,
      current: this.currentVoiceId,
    };
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

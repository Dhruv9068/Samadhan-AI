import { ElevenLabs } from 'elevenlabs-node';

// Initialize ElevenLabs
const elevenlabs = new ElevenLabs({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
});

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

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        console.error('❌ ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY in your environment variables.');
        throw new Error('ElevenLabs API key not configured');
      }

      this.isInitialized = true;
      console.log('✅ ElevenLabs initialized successfully');
    } catch (error) {
      console.error('❌ ElevenLabs initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  // Set voice based on language
  setVoice(language: string, voiceType: 'samadhan' | 'assistant' = 'samadhan') {
    const langCode = language.split('-')[0];
    const voices = VOICE_IDS[langCode as keyof typeof VOICE_IDS] || VOICE_IDS['en-US'];
    this.currentVoiceId = voices[voiceType];
    console.log(`🎤 Voice set to: ${voiceType} for language: ${language}`);
  }

  // Text-to-Speech with ElevenLabs
  async textToSpeech(text: string, language: string = 'en-US'): Promise<ArrayBuffer> {
    try {
      if (!this.isInitialized) {
        this.initialize();
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

      const audioBuffer = await elevenlabs.textToSpeech({
        text: cleanText,
        voiceId: this.currentVoiceId,
        modelId: 'eleven_multilingual_v2', // Use multilingual model for better language support
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.0,
          useSpeakerBoost: true,
        },
      });

      return audioBuffer;
    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      throw error;
    }
  }

  // Speech-to-Speech (Voice Cloning) - for future use
  async speechToSpeech(audioBlob: Blob, targetText: string, language: string = 'en-US'): Promise<ArrayBuffer> {
    try {
      if (!this.isInitialized) {
        this.initialize();
      }

      // Set appropriate voice for the language
      this.setVoice(language);

      console.log('🎤 ElevenLabs STS:', { targetText, voiceId: this.currentVoiceId });

      // Convert blob to buffer
      const arrayBuffer = await audioBlob.arrayBuffer();

      const audioBuffer = await elevenlabs.speechToSpeech({
        audio: arrayBuffer,
        voiceId: this.currentVoiceId,
        modelId: 'eleven_multilingual_v2',
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.0,
          useSpeakerBoost: true,
        },
      });

      return audioBuffer;
    } catch (error) {
      console.error('❌ ElevenLabs STS error:', error);
      throw error;
    }
  }

  // Get available voices
  async getVoices() {
    try {
      if (!this.isInitialized) {
        this.initialize();
      }

      const voices = await elevenlabs.voices.getAll();
      return voices;
    } catch (error) {
      console.error('❌ Error fetching voices:', error);
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

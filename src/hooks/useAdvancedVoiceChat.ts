import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getSafeDb, COLLECTIONS, serverTimestamp } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { geminiAI, AIResponse } from '../lib/gemini';
import { elevenLabsService } from '../lib/elevenlabs';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  addEventListener(type: 'start' | 'end', listener: (event: Event) => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useAdvancedVoiceChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize session
    setSessionId(uuidv4());

    // Initialize AudioContext for ElevenLabs audio playback
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new AudioContext();
      setAudioContext(context);
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage;

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      });

      recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      });

      recognition.addEventListener('end', () => {
        setIsListening(false);
      });

      setRecognition(recognition);
    }
  }, [currentLanguage]);

  const callGeminiAI = async (message: string, language: string): Promise<AIResponse> => {
    try {
      console.log('🤖 Calling Gemini AI...');
      
      // Extract language code from full language string (e.g., 'en-US' -> 'en')
      const langCode = language.split('-')[0];
      
      const response = await geminiAI.generateResponse(message, langCode);
      console.log('✅ Gemini AI response received:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Gemini AI error:', error);
      throw error;
    }
  };

  const speakWithElevenLabs = async (text: string, language: string) => {
    try {
      setIsSpeaking(true);
      
      // Get audio buffer from ElevenLabs
      const audioBuffer = await elevenLabsService.textToSpeech(text, language);
      
      if (audioContext && audioBuffer) {
        // Decode the audio buffer
        const decodedAudio = await audioContext.decodeAudioData(audioBuffer);
        
        // Create audio source
        const source = audioContext.createBufferSource();
        source.buffer = decodedAudio;
        source.connect(audioContext.destination);
        
        // Play the audio
        source.start(0);
        
        // Handle completion
        source.onended = () => {
          setIsSpeaking(false);
        };
        
        console.log('🎤 ElevenLabs audio playing...');
      }
    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      setIsSpeaking(false);
      
      // Fallback to basic speech synthesis if ElevenLabs fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: transcript,
      isUser: true,
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Call Gemini AI
      const aiResult = await callGeminiAI(transcript, currentLanguage);
      
      // Check if this is a complaint that should be saved
      const isComplaint = transcript.toLowerCase().includes('complaint') || 
                         transcript.toLowerCase().includes('problem') ||
                         transcript.toLowerCase().includes('issue') ||
                         (aiResult.analysis && aiResult.analysis.isComplaint);

      if (isComplaint && aiResult.analysis) {
        // Save complaint to Firebase using getSafeDb()
        try {
          const db = getSafeDb();
          await addDoc(collection(db, COLLECTIONS.COMPLAINTS), {
            title: `Voice Complaint - ${aiResult.analysis.category}`,
            description: transcript,
            category: aiResult.analysis.category,
            priority: aiResult.analysis.priority,
            status: 'pending',
            department: aiResult.analysis.department,
            sentiment: aiResult.analysis.sentiment,
            watson_reply: aiResult.response,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log('✅ Complaint saved to Firebase');
        } catch (firebaseError) {
          console.error('❌ Firebase save error:', firebaseError);
          // Continue without saving to Firebase
        }
      }

      // Save chat session
      await saveChatSession(userMessage, aiResult.response);

      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: aiResult.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response using ElevenLabs
      await speakWithElevenLabs(aiResult.response, currentLanguage);
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: '**Samadhan AI:** I apologize, but I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveChatSession = async (userMessage: ChatMessage, botResponse: string) => {
    try {
      const db = getSafeDb();
      const sessionRef = doc(db, COLLECTIONS.CHAT_SESSIONS, sessionId);
      const sessionDoc = await getDoc(sessionRef);

      const messages = sessionDoc.exists() ? sessionDoc.data().messages || [] : [];
      messages.push(userMessage, {
        id: uuidv4(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      });

      if (sessionDoc.exists()) {
        await updateDoc(sessionRef, {
          messages,
          language: currentLanguage,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, COLLECTIONS.CHAT_SESSIONS), {
          id: sessionId,
          messages,
          language: currentLanguage,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error saving chat session:', error);
      // Continue without saving chat session
    }
  };

  const speakText = async (text: string) => {
    // Use ElevenLabs for high-quality TTS
    await speakWithElevenLabs(text, currentLanguage);
  };

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const stopSpeaking = useCallback(() => {
    // Stop ElevenLabs audio if playing
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend();
    }
    
    // Stop basic speech synthesis if using fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
  }, [audioContext]);

  const sendTextMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Call Gemini AI
      const aiResult = await callGeminiAI(text, currentLanguage);
      
      // Check if this is a complaint
      const isComplaint = text.toLowerCase().includes('complaint') || 
                         text.toLowerCase().includes('problem') ||
                         text.toLowerCase().includes('issue') ||
                         (aiResult.analysis && aiResult.analysis.isComplaint);

      if (isComplaint && aiResult.analysis) {
        // Save complaint to Firebase using getSafeDb()
        try {
          const db = getSafeDb();
          await addDoc(collection(db, COLLECTIONS.COMPLAINTS), {
            title: `Text Complaint - ${aiResult.analysis.category}`,
            description: text,
            category: aiResult.analysis.category,
            priority: aiResult.analysis.priority,
            status: 'pending',
            department: aiResult.analysis.department,
            sentiment: aiResult.analysis.sentiment,
            watson_reply: aiResult.response,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log('✅ Complaint saved to Firebase');
        } catch (firebaseError) {
          console.error('❌ Firebase save error:', firebaseError);
          // Continue without saving to Firebase
        }
      }

      // Save chat session
      await saveChatSession(userMessage, aiResult.response);

      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: aiResult.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending text message:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: '**Samadhan AI:** I apologize, but I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [currentLanguage, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(uuidv4());
  }, []);

  return {
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    currentLanguage,
    startListening,
    stopListening,
    stopSpeaking,
    sendTextMessage,
    setCurrentLanguage,
    clearChat,
  };
};
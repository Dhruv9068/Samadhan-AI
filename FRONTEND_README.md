# Samadhan AI Frontend

A modern, AI-powered frontend application for the UP CM Helpline 1076 automation system, built with React, TypeScript, and powered by Gemini AI.

## 🚀 Features

- **🤖 Gemini AI Integration**: Powered by Google's Gemini AI for intelligent responses
- **🎤 Voice Recognition**: Speech-to-text support in 10+ Indian languages
- **🔊 Text-to-Speech**: AI responses are spoken back to users
- **🌐 Multilingual Support**: Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi
- **🔥 Firebase Integration**: Real-time data storage and authentication
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Beautiful, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI**: Google Gemini AI API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS + Framer Motion
- **Voice**: Web Speech API
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini AI API key
- Firebase project setup

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your keys:

```bash
cp env.example .env
```

Fill in your actual values in `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get API Keys

#### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `VITE_GEMINI_API_KEY`

#### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore, Auth, and Storage
4. Get your config from Project Settings > General > Your Apps
5. Copy the values to your `.env` file

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## 🎯 Usage

### Voice Chat
1. Click the microphone button to start voice recognition
2. Speak your complaint or query in any supported language
3. The AI will process and respond appropriately
4. Responses are automatically spoken back to you

### Text Chat
1. Type your message in the text input
2. Press Enter or click Send
3. Receive AI-powered responses

### Language Support
- **English**: Default language
- **Hindi**: हिंदी
- **Bengali**: বাংলা
- **Tamil**: தமிழ்
- **Telugu**: తెలుగు
- **Marathi**: मराठी
- **Gujarati**: ગુજરાતી
- **Kannada**: ಕನ್ನಡ
- **Malayalam**: മലയാളം
- **Punjabi**: ਪੰਜਾਬੀ

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Chat/           # Chat-related components
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # External library configurations
│   ├── firebase.ts     # Firebase setup
│   ├── gemini.ts       # Gemini AI integration
│   └── ...
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🔧 Configuration

### Firebase Rules
Ensure your Firestore has appropriate security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /complaints/{document} {
      allow read, write: if request.auth != null;
    }
    match /chat_sessions/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Gemini AI Prompt Customization
Edit `src/lib/gemini.ts` to customize the AI behavior:

```typescript
const SAMADHAN_SYSTEM_PROMPT = `Your custom prompt here...`;
```

## 🚨 Troubleshooting

### Common Issues

1. **Gemini AI not responding**
   - Check your API key in `.env`
   - Verify API quota and billing
   - Check browser console for errors

2. **Voice recognition not working**
   - Ensure HTTPS in production
   - Check browser permissions
   - Try different browsers

3. **Firebase connection issues**
   - Verify Firebase config in `.env`
   - Check Firebase project settings
   - Ensure Firestore is enabled

### Debug Mode
Enable debug mode in `.env`:

```env
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

## 📱 Browser Support

- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

**Note**: Voice recognition requires HTTPS in production.

## 🔒 Security

- API keys are stored in environment variables
- Firebase security rules protect data
- No sensitive data is logged
- HTTPS required for voice features

## 📄 License

This project is part of the Samadhan AI system for UP CM Helpline 1076.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review Firebase and Gemini AI documentation
- Open an issue in the repository

---

**Samadhan AI** - Making government services more accessible through AI innovation.

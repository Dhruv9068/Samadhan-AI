# Firebase Security Rules for Samadhan AI

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    // In production, you should implement more granular rules
    
    // Complaints collection
    match /complaints/{document} {
      allow read, write: if true; // Allow public access for demo
      // In production, use: allow read, write: if request.auth != null;
    }
    
    // Departments collection
    match /departments/{document} {
      allow read: if true; // Public read access
      allow write: if true; // Allow public write for demo
      // In production, use: allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Chat sessions collection
    match /chat_sessions/{document} {
      allow read, write: if true; // Allow public access for demo
      // In production, use: allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if true; // Allow public access for demo
      // In production, use: allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Analytics collection (read-only for most users)
    match /analytics/{document} {
      allow read: if true;
      allow write: if true; // Allow public write for demo
      // In production, use: allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to all files for authenticated users
    match /{allPaths=**} {
      allow read, write: if true; // Allow public access for demo
      // In production, use: allow read, write: if request.auth != null;
    }
    
    // Complaint attachments
    match /complaints/{complaintId}/{fileName} {
      allow read: if true; // Public read access
      allow write: if true; // Allow public write for demo
      // In production, use: allow write: if request.auth != null;
    }
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if true; // Allow public write for demo
      // In production, use: allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Authentication Configuration

### Enable Authentication Methods:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable the following providers:
   - Email/Password ✅
   - Anonymous (optional for guest access) ✅
   - Google (optional) ✅

### User Management:
- Create admin users with custom claims
- Set up role-based access control

## Production Security Recommendations

### 1. Implement Proper Authentication
```javascript
// Example of secure rules for production
match /complaints/{document} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && validateComplaint();
  allow update: if request.auth != null && 
    (request.auth.uid == resource.data.user_id || 
     request.auth.token.admin == true);
  allow delete: if request.auth != null && 
    request.auth.token.admin == true;
}

function validateComplaint() {
  return request.resource.data.keys().hasAll(['title', 'description', 'category']) &&
         request.resource.data.title is string &&
         request.resource.data.description is string &&
         request.resource.data.category in ['Infrastructure', 'Utilities', 'Environment', 'Traffic', 'Healthcare', 'Education', 'Other'];
}
```

### 2. Rate Limiting
```javascript
// Implement rate limiting for complaint submissions
match /complaints/{document} {
  allow create: if request.auth != null && 
    validateComplaint() &&
    !exceedsRateLimit();
}

function exceedsRateLimit() {
  // Check if user has submitted more than 5 complaints in the last hour
  return false; // Implement your rate limiting logic
}
```

### 3. Data Validation
```javascript
// Validate data structure and content
function validateComplaint() {
  let data = request.resource.data;
  return data.keys().hasAll(['title', 'description', 'category', 'priority']) &&
         data.title is string && data.title.size() > 0 && data.title.size() <= 200 &&
         data.description is string && data.description.size() > 0 && data.description.size() <= 2000 &&
         data.category in ['Infrastructure', 'Utilities', 'Environment', 'Traffic', 'Healthcare', 'Education', 'Other'] &&
         data.priority in ['low', 'medium', 'high', 'critical'] &&
         data.status in ['pending', 'assigned', 'in-progress', 'resolved', 'closed'];
}
```

### 4. Admin-Only Operations
```javascript
// Restrict certain operations to admin users
match /departments/{document} {
  allow read: if true; // Public read
  allow write: if request.auth != null && 
    request.auth.token.admin == true;
}

match /analytics/{document} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    request.auth.token.admin == true;
}
```

## Environment Variables Setup

Create a `.env` file with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Checklist

- [ ] Enable Firebase Security Rules
- [ ] Set up proper authentication
- [ ] Implement role-based access control
- [ ] Add data validation rules
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure CORS properly
- [ ] Use HTTPS only
- [ ] Implement proper error handling
- [ ] Set up monitoring and alerts

## Testing Security Rules

Use Firebase Emulator Suite to test your security rules:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

Test your rules with different user scenarios to ensure they work as expected.
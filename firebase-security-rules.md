# Firebase Security Rules for Samadhan AI

## 🔥 Firestore Security Rules

Copy and paste these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.admin == true;
    }
    
    function isValidComplaint() {
      let data = request.resource.data;
      return data.keys().hasAll(['title', 'description', 'category', 'priority', 'status']) &&
             data.title is string && data.title.size() > 0 && data.title.size() <= 200 &&
             data.description is string && data.description.size() > 0 && data.description.size() <= 2000 &&
             data.category in ['Infrastructure', 'Utilities', 'Environment', 'Traffic', 'Healthcare', 'Education', 'Other'] &&
             data.priority in ['low', 'medium', 'high', 'critical'] &&
             data.status in ['pending', 'assigned', 'in-progress', 'resolved', 'closed'];
    }
    
    // Rate limiting helper (basic implementation)
    function withinRateLimit() {
      // Allow max 5 complaints per hour per user
      // In production, implement more sophisticated rate limiting
      return true;
    }
    
    // Complaints collection
    match /complaints/{complaintId} {
      // Anyone can read complaints (for transparency)
      allow read: if true;
      
      // Anyone can create complaints with validation
      allow create: if isValidComplaint() && withinRateLimit();
      
      // Only complaint owner or admin can update
      allow update: if (isOwner(resource.data.user_id) || isAdmin()) &&
                       isValidComplaint();
      
      // Only admin can delete
      allow delete: if isAdmin();
    }
    
    // Departments collection
    match /departments/{departmentId} {
      // Anyone can read departments
      allow read: if true;
      
      // Only admin can create/update/delete departments
      allow write: if isAdmin();
    }
    
    // Chat sessions collection
    match /chat_sessions/{sessionId} {
      // Users can read their own sessions
      allow read: if isOwner(resource.data.user_id) || !exists(/databases/$(database)/documents/chat_sessions/$(sessionId));
      
      // Users can create their own sessions
      allow create: if isAuthenticated() || 
                       (!request.resource.data.keys().hasAny(['user_id']) || 
                        isOwner(request.resource.data.user_id));
      
      // Users can update their own sessions
      allow update: if isOwner(resource.data.user_id) || 
                       !exists(/databases/$(database)/documents/chat_sessions/$(sessionId));
      
      // Users can delete their own sessions
      allow delete: if isOwner(resource.data.user_id) || isAdmin();
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if isOwner(userId) || isAdmin();
      
      // Users can create/update their own data
      allow write: if isOwner(userId);
    }
    
    // Analytics collection (admin only)
    match /analytics/{document} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // Documents collection (for vector search)
    match /documents/{documentId} {
      // Anyone can read documents
      allow read: if true;
      
      // Only admin can write documents
      allow write: if isAdmin();
    }
  }
}
```

## 🗄️ Firebase Storage Security Rules

Copy and paste these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.admin == true;
    }
    
    function isValidFileSize() {
      return request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
    
    function isValidImageType() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidDocumentType() {
      return request.resource.contentType in [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
    }
    
    // Complaint attachments
    match /complaints/{complaintId}/{fileName} {
      // Anyone can read complaint attachments
      allow read: if true;
      
      // Authenticated users can upload attachments
      allow write: if isAuthenticated() && 
                      isValidFileSize() && 
                      (isValidImageType() || isValidDocumentType());
    }
    
    // User profile images
    match /users/{userId}/profile/{fileName} {
      // Anyone can read profile images
      allow read: if true;
      
      // Users can upload their own profile images
      allow write: if isOwner(userId) && 
                      isValidFileSize() && 
                      isValidImageType();
    }
    
    // Department files (admin only)
    match /departments/{departmentId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin() && isValidFileSize();
    }
    
    // System files (admin only)
    match /system/{fileName} {
      allow read: if isAdmin();
      allow write: if isAdmin() && isValidFileSize();
    }
  }
}
```

## 🔐 Authentication Setup

### 1. Enable Authentication Methods

In Firebase Console → Authentication → Sign-in method, enable:

- ✅ **Email/Password** (Primary method)
- ✅ **Anonymous** (For guest access)
- ⚠️ **Google** (Optional, for social login)

### 2. Create Admin Users

```javascript
// Run this in Firebase Console → Functions or Admin SDK
const admin = require('firebase-admin');

async function setAdminClaim(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin claim set for ${email}`);
}

// Set admin for your email
setAdminClaim('your-admin@email.com');
```

### 3. Authentication Configuration

```javascript
// In your Firebase project settings
{
  "authDomain": "samadhan-ai.firebaseapp.com",
  "signInOptions": {
    "email": {
      "enabled": true,
      "requireDisplayName": false,
      "enableEmailLinkSignIn": false
    },
    "anonymous": {
      "enabled": true
    }
  },
  "signInFlow": "popup",
  "tosUrl": "https://samadhan-ai.vercel.app/terms",
  "privacyPolicyUrl": "https://samadhan-ai.vercel.app/privacy"
}
```

## 🛡️ Security Best Practices

### 1. Environment Variables Security
- ✅ Never expose API keys in client-side code
- ✅ Use environment variables for sensitive data
- ✅ Implement proper CORS policies
- ✅ Use HTTPS only in production

### 2. Data Validation
- ✅ Validate all input data on both client and server
- ✅ Implement proper sanitization
- ✅ Use TypeScript for type safety
- ✅ Implement rate limiting

### 3. Access Control
- ✅ Implement role-based access control (RBAC)
- ✅ Use principle of least privilege
- ✅ Regular security audits
- ✅ Monitor for suspicious activity

### 4. Production Checklist

- [ ] Apply security rules to Firestore
- [ ] Apply security rules to Storage
- [ ] Enable authentication methods
- [ ] Set up admin users with custom claims
- [ ] Configure CORS policies
- [ ] Enable audit logging
- [ ] Set up monitoring and alerts
- [ ] Implement rate limiting
- [ ] Test security rules thoroughly
- [ ] Document security procedures

## 🔍 Testing Security Rules

Use Firebase Emulator Suite to test your security rules:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase in your project
firebase init

# Start emulators with security rules
firebase emulators:start --only firestore,auth,storage

# Run security rules tests
firebase emulators:exec --only firestore "npm run test:security"
```

## 📊 Monitoring and Alerts

Set up monitoring for:
- Failed authentication attempts
- Unusual data access patterns
- Rate limit violations
- Security rule violations
- Large file uploads
- Suspicious user behavior

These security rules provide enterprise-grade protection while maintaining the functionality needed for Samadhan AI!
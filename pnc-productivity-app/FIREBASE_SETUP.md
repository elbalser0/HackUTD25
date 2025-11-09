# Firebase Setup Guide for PNC Productivity App

This guide will help you set up Firebase for your PNC Productivity App hackathon project.

## 🚀 Quick Start (Mock Mode)

The app is currently configured to work with **mock Firebase** by default, so you can develop and test without setting up Firebase immediately.

- ✅ Authentication works with mock users
- ✅ Firestore operations are simulated
- ✅ Perfect for hackathon development and demos

## 🔥 Setting Up Real Firebase (Optional)

If you want to use real Firebase (recommended for production or advanced testing):

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `pnc-productivity-app`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Save

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for hackathon)
4. Select a location (e.g., `us-central`)
5. Done

### Step 4: Get Firebase Configuration

1. In Firebase Console, click the **⚙️ Settings** gear icon
2. Go to **Project settings**
3. Scroll down to **Your apps**
4. Click **Add app** > **Web app** (🌐)
5. Register app name: `PNC Productivity App`
6. Copy the `firebaseConfig` object

### Step 5: Update Environment Variables

1. Open `.env` file in your project root
2. Replace the placeholder values with your Firebase config:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Set to false to use real Firebase
EXPO_PUBLIC_USE_MOCK_AUTH=false
```

### Step 6: Restart Development Server

```bash
# Stop the current Expo server (Ctrl+C)
# Then restart:
npx expo start --tunnel
```

## 🔧 Configuration Modes

### Mock Mode (Default)
- `EXPO_PUBLIC_USE_MOCK_AUTH=true`
- No Firebase setup required
- Perfect for hackathon development
- Authentication and data are simulated

### Firebase Mode
- `EXPO_PUBLIC_USE_MOCK_AUTH=false`
- Requires real Firebase project
- Real authentication and data persistence
- Production-ready setup

## 📊 Firebase Collections Structure

When using real Firebase, the app will create these collections:

```
📁 documents/
   └── 📄 {document-id}
       ├── type: string (strategy, prd, research, gtm, backlog)
       ├── title: string
       ├── content: string
       ├── toolName: string
       ├── userId: string
       ├── createdAt: timestamp
       └── updatedAt: timestamp

📁 prds/
   └── 📄 {prd-id}
       ├── title: string
       ├── description: string
       ├── userId: string
       ├── createdAt: timestamp
       └── updatedAt: timestamp

📁 backlog/
   └── 📄 {item-id}
       ├── title: string
       ├── description: string
       ├── workspaceId: string
       ├── priority: number
       ├── reach: number
       ├── impact: number
       ├── confidence: number
       ├── effort: number
       ├── createdAt: timestamp
       └── updatedAt: timestamp

📁 workspaces/
   └── 📄 {workspace-id}
       ├── name: string
       ├── description: string
       ├── members: array[userId]
       ├── createdAt: timestamp
       └── updatedAt: timestamp

📁 feedback/
   └── 📄 {feedback-id}
       ├── content: string
       ├── workspaceId: string
       ├── sentiment: object
       ├── tags: array
       └── createdAt: timestamp
```

## 🔒 Security Rules

**IMPORTANT:** You must set up Firestore security rules to protect user data. Copy the rules from `firestore.rules` file in your project root and paste them into your Firebase Console.

### How to Set Up Security Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** > **Rules** tab
4. Copy the contents of `firestore.rules` from your project
5. Paste into the Firebase Console rules editor
6. Click **Publish**

### Security Rules Overview:

The rules enforce:

- **Documents Collection**: Users can only access their own documents (PDFs, generated content)
- **PRDs Collection**: Users can only access their own Product Requirements Documents
- **Workspaces Collection**: Only workspace members can access workspace data
- **Backlog Collection**: Users can only access backlog items from workspaces they're members of
- **Feedback Collection**: Users can only access feedback from workspaces they're members of

All operations require authentication, and data validation ensures:
- Users cannot access other users' data
- Users cannot modify userId/workspaceId fields
- Workspace membership is verified for shared resources

### For Development/Testing:

If you're still in development and want to test quickly, you can temporarily use test mode rules (NOT recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

⚠️ **Warning**: Test mode allows anyone with your Firebase config to read/write all data. Only use for development!

## 🎯 Hackathon Tips

### For Demo/Testing:
- Keep `EXPO_PUBLIC_USE_MOCK_AUTH=true`
- Focus on building features, not Firebase setup
- Mock data is perfect for demonstrations

### For Real Data:
- Set up Firebase (15 minutes)
- Set `EXPO_PUBLIC_USE_MOCK_AUTH=false`
- Perfect for judge testing with real persistence

## 🚨 Troubleshooting

### Common Issues:

**Error: "Component auth has not been registered"**
- Solution: Make sure Firebase is properly installed: `npm install firebase`

**Error: "Invalid API key"**
- Solution: Double-check your API key in `.env` file

**Error: "Permission denied"**
- Solution: Make sure Firestore is in test mode or rules allow access

**App still uses mock data**
- Solution: Set `EXPO_PUBLIC_USE_MOCK_AUTH=false` and restart server

## 📞 Support

During the hackathon, if you need help:
1. Check this guide first
2. Look at console logs for specific error messages
3. Try switching back to mock mode if Firebase issues block progress

The app is designed to work seamlessly in both modes! 🎉
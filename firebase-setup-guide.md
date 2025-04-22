# Firebase Setup Guide

## 1. Create a .env file in the project root

Create a file named `.env` (not `.env.example`) in the root directory with the following format:

```
# Firebase Config
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## 2. Replace the placeholder values with your actual Firebase credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon (⚙️) next to "Project Overview" → "Project settings"
4. Scroll down to "Your apps" section and click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "circle-tracker-web") 
6. Copy the values from the `firebaseConfig` object into your `.env` file:

```javascript
const firebaseConfig = {
  apiKey: "xxx",            // → FIREBASE_API_KEY
  authDomain: "xxx",        // → FIREBASE_AUTH_DOMAIN
  projectId: "xxx",         // → FIREBASE_PROJECT_ID
  storageBucket: "xxx",     // → FIREBASE_STORAGE_BUCKET
  messagingSenderId: "xxx", // → FIREBASE_MESSAGING_SENDER_ID
  appId: "xxx"              // → FIREBASE_APP_ID
};
```

## 3. Enable Authentication and Firestore

1. In the Firebase Console, go to "Authentication" and enable Email/Password authentication
2. Go to "Firestore Database" and create a database (start in test mode for now)

## 4. Restart your Expo app

After setting up your `.env` file with the correct Firebase credentials, restart your app:

```bash
npm start
```

## 5. Testing

1. Use the Register function to create a new user
2. Add some tasks and track progress
3. Check the "Data Sync" section in Settings to make sure syncing works

## 6. Security Rules

Once your app is working, you should update your Firestore security rules to protect your data. Go to the Firebase Console → Firestore Database → Rules and update them to something like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /dailyProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures that users can only access their own data. 
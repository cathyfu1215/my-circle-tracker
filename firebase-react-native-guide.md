# Firebase Setup Guide for React Native

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

## 2. Replace placeholder values with actual Firebase credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon (⚙️) next to "Project Overview" → "Project settings"
4. In "Your apps" section, add an Android app if not already added
   - Package name: Can be your app identifier (e.g., `com.yourname.circletracker`)
   - Download `google-services.json` file (you'll need it for a full React Native setup)
5. Copy the values from the web app's `firebaseConfig` object into your `.env` file

## 3. Enable Authentication and Firestore

1. In the Firebase Console, go to "Authentication" and enable Email/Password authentication
2. Go to "Firestore Database" and create a database (start in test mode for now)

## 4. For better React Native support:

For a complete React Native Firebase setup (beyond our current implementation), you would:

1. Install required Firebase packages:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
   ```

2. Follow the official React Native Firebase setup guide for platform-specific setup:
   - [Android setup](https://rnfirebase.io/android/setup)
   - [iOS setup](https://rnfirebase.io/ios/setup)

3. Add your `google-services.json` file to the appropriate location in your project

## 5. Testing

Test the authentication and data syncing:

1. Use the Register function to create a new user
2. Add some tasks and track progress
3. Check the "Data Sync" section in Settings to make sure syncing works
4. Close and reopen the app to verify persistence works

## 6. Troubleshooting Authentication Persistence

If you're still having issues with authentication persistence:

1. Ensure AsyncStorage package is properly installed:
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. Verify the AuthContext.tsx implementation is correctly handling login/logout
3. Check the console logs for any authentication related errors
4. Consider implementing the full React Native Firebase SDK for better native support 
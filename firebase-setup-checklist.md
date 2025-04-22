# Firebase Setup Checklist

## Environment Variables Checklist

The Firestore errors you're seeing indicate problems with the Firebase configuration, particularly with the project ID. Follow these steps to verify your setup:

1. **Check .env file exists**
   - Ensure you have a `.env` file in the root directory of your project
   - It should NOT have quotes around the values

2. **Verify all required values are present and not empty**
   ```
   FIREBASE_API_KEY=your_api_key_here
   FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

3. **Run the environment check script**
   ```bash
   node scripts/check-env.js
   ```

4. **Check your Firebase project ID carefully**
   - The Firestore errors show `"database": "projects/undefined/databases/(default)"`
   - This typically means `FIREBASE_PROJECT_ID` is undefined or empty
   - Double-check the spelling of your project ID in the Firebase console

## Fix Steps

1. **Create or correct your .env file**
   - Go to Firebase Console → Project Settings
   - Make sure to copy the exact project ID

2. **Restart your app completely**
   - Kill the Expo dev server: `CTRL+C`
   - Restart: `npm start`
   - Reload your app in the emulator

3. **Check debug logs**
   - Look for the "Firebase configuration check" messages we added
   - Verify that Project ID is not showing as "MISSING"

## Common Mistakes

- Using quotes around environment variable values
- Typos in the project ID
- Using placeholders without replacing them with actual values
- Not restarting the app after updating the .env file

## If Problems Persist

If you still see Firestore errors after completing the checklist:

1. Try hard-coding the Firebase config values directly in the `services/firebase.ts` file temporarily to test
2. Check if your Firebase project has proper Firestore permissions
3. Verify that your Firebase project has Firestore database created
4. Check if the emulator has internet access 
# Setting up Environment Variables for Firebase

## 1. Create a .env file

Create a file named `.env` in the root of your project with the following content:

```
# Firebase Config
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
```

Replace the placeholder values with your actual Firebase credentials from the Firebase console.

## 2. Install required packages

To use environment variables in a React Native (Expo) project, you'll need to install:

```bash
npm install react-native-dotenv
```

## 3. Configure babel

Add the dotenv plugin to your babel config. Update your `babel.config.js` file:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }]
    ]
  };
};
```

## 4. Update your firebase.ts file

After installing and configuring the above, update your firebase.ts file to use the environment variables. 
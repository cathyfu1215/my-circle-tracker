# CircleTracker

CircleTracker is a React Native (Expo) app that helps users track daily tasks visually. Each day is represented as a colorful pie chart with up to 7 slices, where each slice represents a user-defined task. Users can track progress in 4 levels: "nothing", "minimal", "target", and "beyond target".

## Features

- 🔄 Track up to 7 daily tasks visually in a circle chart
- 🎨 Each task has a unique color with varying shades based on completion level
- 🔐 User authentication with Firebase
- 💾 Data syncing between local storage and cloud
- 📱 Cross-platform (iOS & Android)

## Project Structure

```
my-circle-tracker/
├── assets/                 # Static files (icons, fonts)
├── components/             # Reusable components (TaskCircle, ColorPicker, etc.)
├── constants/              # Fixed values (color palette, levels)
├── features/               # Logic by feature domain
│   ├── auth/               # Firebase auth (email login)
│   ├── tasks/              # Task management logic
│   └── progress/           # Daily tracking and history
├── hooks/                  # Custom hooks (e.g. useTracker, useAuth)
├── navigation/             # Navigation configuration (React Navigation)
├── screens/                # App screens (Home, History, Login, Settings)
├── services/               # Firebase & storage integration
├── store/                  # Global state (Zustand)
├── utils/                  # Reusable utilities (e.g. date helpers)
├── App.tsx                 # Main app entry
└── app.json                # Expo config
```

## Technologies Used

- **React Native (Expo)** - Framework for building the app
- **TypeScript** - For type safety
- **Firebase** - Authentication and cloud storage
- **AsyncStorage** - Local data persistence
- **Zustand** - State management
- **React Navigation** - Screen navigation

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/my-circle-tracker.git
   ```

2. Install dependencies
   ```
   cd my-circle-tracker
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Update the Firebase configuration in `services/firebase.ts`

4. Start the development server
   ```
   npm start
   ```

5. Run on simulator or device using Expo Go app

## Future Enhancements

- Gamification (badges, streaks, achievements)
- Reminders and notifications
- Analytics and insights
- Social sharing
- Dark mode

## License

ISC


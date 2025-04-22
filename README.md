# 🌈 CircleTracker – Visualize Your Daily Wins

**CircleTracker** is a cross-platform daily task tracker built with React Native (Expo).  
Track up to 7 customizable tasks daily, visualize your progress with color-coded pie charts, and gamify your productivity!

## 🧠 Features
- ✅ 1–7 Custom Tasks Per User
- 🎯 4 Fixed Progress Levels:
  - `Nothing`, `Minimal`, `Target`, `Beyond Target`
- 🍥 Daily Task Circle:
  - Each day is represented by a 7-slice color-coded pie chart.
- 📅 History View:
  - Track your weekly, monthly, and yearly progress.
- 🔐 Email Login Required
- 💾 Dual Storage:
  - Saves data both locally and in the cloud for syncing.




## 🛠️ Tech Stack

- ⚛️ React Native (with Expo)
- 🧠 Zustand (for state management)
- 🔐 Firebase Auth (email login)
- ☁️ Firebase Firestore (for cloud storage)
- 💾 AsyncStorage (for local caching/offline access)
- 🎨 react-native-svg (for drawing circular charts)

## 🏁 Getting Started

### 1. Clone the Repo
```
git clone https://github.com/cathyfu1215/my-circle-tracker.git
cd circle-tracker
```

2. Install Dependencies

```
npm install
```
or
```
yarn install
```


3. Run the App
```
npx expo start
```

## 📦 Project Structure
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
├── app.json                # Expo config
└── README.md               # You're reading it!
```

## 🎨 Task Color Palette
Users choose a unique color per task from a fixed set (e.g. red, green, blue, orange, teal, purple, pink).


Color intensity reflects progress level:

- White = nothing


- Light = minimal


- Medium = target


- Dark = beyond target

## 🧭 Roadmap
- 🔔 Daily reminders


- 🏆 Streaks & badges


- 📊 Advanced insights


- 🧠 AI-generated reflections

## 📜 License
MIT – use it, improve it, or remix it 🔄


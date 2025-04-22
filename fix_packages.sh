#!/bin/bash

# Install missing polyfills package
npm install @react-native/js-polyfills --save

# Update packages to match Expo SDK 52
npx expo install \
  @react-native-async-storage/async-storage@1.23.1 \
  expo-status-bar@~2.0.1 \
  react@18.3.1 \
  react-dom@18.3.1 \
  react-native@0.76.9 \
  react-native-gesture-handler@~2.20.2 \
  react-native-get-random-values@~1.11.0 \
  react-native-safe-area-context@4.12.0 \
  react-native-screens@~4.4.0 \
  react-native-svg@15.8.0

echo "Packages updated to match Expo SDK 52" 
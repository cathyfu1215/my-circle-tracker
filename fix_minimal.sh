#!/bin/bash

# Install missing polyfills package
npm install @react-native/js-polyfills --save --legacy-peer-deps

# Create assets folder if it doesn't exist
mkdir -p assets

# Only if favicon.png doesn't exist, download it
if [ ! -f assets/favicon.png ]; then
  # Download a simple favicon
  curl -o assets/favicon.png https://raw.githubusercontent.com/expo/expo/main/templates/expo-template-blank/assets/favicon.png
  echo "Downloaded favicon.png to assets folder"
fi

echo "Fixed minimal requirements" 
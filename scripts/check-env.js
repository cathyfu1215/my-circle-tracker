/**
 * Script to check if .env file exists and has required values
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to .env file
const envPath = path.join(__dirname, '..', '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env file not found at:', envPath);
  console.error('Please create a .env file with your Firebase configuration.');
  process.exit(1);
}

// Read and parse .env file
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// Required Firebase variables
const requiredVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

// Check for missing variables
const missingVars = requiredVars.filter(varName => !envConfig[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERROR: The following required variables are missing in your .env file:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  process.exit(1);
}

// Check for empty variables
const emptyVars = requiredVars.filter(varName => envConfig[varName] === '');

if (emptyVars.length > 0) {
  console.error('⚠️ WARNING: The following variables are empty in your .env file:');
  emptyVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
}

// Success message
if (missingVars.length === 0 && emptyVars.length === 0) {
  console.log('✅ All required environment variables are defined in your .env file.');
  console.log('Firebase configuration:');
  requiredVars.forEach(varName => {
    // Mask sensitive values
    const value = varName === 'FIREBASE_API_KEY' || varName === 'FIREBASE_APP_ID' 
      ? `${envConfig[varName].substring(0, 5)}...` 
      : envConfig[varName];
    console.log(`  - ${varName}: ${value}`);
  });
} else if (missingVars.length === 0) {
  console.log('⚠️ All required environment variables exist but some are empty.');
}

// Additional check for projectId which is critical
if (!envConfig.FIREBASE_PROJECT_ID || envConfig.FIREBASE_PROJECT_ID === '') {
  console.error('❗❗ CRITICAL: FIREBASE_PROJECT_ID is undefined or empty.');
  console.error('This will cause Firestore connection errors. Please set a valid project ID.');
} 
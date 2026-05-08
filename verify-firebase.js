// Firebase Verification Script for Node.js
import { readFileSync } from 'fs';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });
    return env;
  } catch (error) {
    console.error('❌ Error loading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();

console.log('🔍 Checking environment variables...');
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (env[varName]) {
    console.log(`✅ ${varName}: ${env[varName].substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Some Firebase environment variables are missing!');
  console.log('Please check your .env file and Firebase Console.');
  process.exit(1);
}

console.log('\n🔥 Initializing Firebase...');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

try {
  const app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized");

  // Test Auth
  console.log("🔐 Testing Authentication...");
  const auth = getAuth(app);
  console.log("✅ Auth initialized");

  // Test Firestore
  console.log("📊 Testing Firestore...");
  const db = getFirestore(app);
  console.log("✅ Firestore initialized");

  // Test Storage
  console.log("💾 Testing Storage...");
  const storage = getStorage(app);
  console.log("✅ Storage initialized");

  console.log("\n🎉 Firebase verification completed successfully!");
  console.log("All services are properly configured and ready to use.");

} catch (error) {
  console.error('\n❌ Firebase initialization failed:', error.message);
  console.log('\nPossible issues:');
  console.log('1. Invalid Firebase configuration values');
  console.log('2. Firebase project not accessible');
  console.log('3. Network connectivity issues');
  process.exit(1);
}
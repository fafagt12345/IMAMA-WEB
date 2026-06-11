import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Fungsi untuk membersihkan spasi atau tanda kutip yang tidak sengaja terbawa dari ENV
const sanitize = (val) => val?.trim().replace(/^["']|["']$/g, '') || '';

const projectId = sanitize(import.meta.env.VITE_FIREBASE_PROJECT_ID);

export const firebaseConfig = {
  apiKey: sanitize(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain:
    sanitize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) ||
    (projectId ? `${projectId}.firebaseapp.com` : ''),
  projectId,
  storageBucket:
    sanitize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ||
    (projectId ? `${projectId}.appspot.com` : ''),
  messagingSenderId: sanitize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitize(import.meta.env.VITE_FIREBASE_APP_ID),
};

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (typeof window !== 'undefined' && missingConfig.length) {
  console.warn('Firebase config belum lengkap, cek variabel VITE_FIREBASE_* di Vercel:', missingConfig);
}

// Hindari inisialisasi ganda
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const storage = getStorage(app);

export const db = (() => {
  // Instance Firestore standar tanpa sinkronisasi cache yang berat
  return getFirestore(app);
})();

export default app;

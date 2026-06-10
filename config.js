import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Aktifkan Offline Persistence dengan API terbaru (FirestoreSettings.cache)
// Gunakan fungsi yang langsung dieksekusi untuk memastikan urutan inisialisasi benar
export const db = (() => {
  try {
    // initializeFirestore hanya bisa dipanggil satu kali sebelum getFirestore manapun dipanggil
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
  } catch (e) {
    // Jika sudah diinisialisasi (misalnya saat proses reload/HMR), ambil instance yang ada
    return getFirestore(app);
  }
})();

export default app;

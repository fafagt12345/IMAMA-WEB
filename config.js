// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore,
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7BX34wi4w-gGXvLeAAtJKHwlqlyHEAUo",
  authDomain: "imama-unesa.firebaseapp.com",
  projectId: "imama-unesa",
  storageBucket: "imama-unesa.firebasestorage.app",
  messagingSenderId: "959135930232",
  appId: "1:959135930232:web:75356fb595ca2beca55a8d",
  measurementId: "G-E9WLD7MF6S"
};

// Initialize Firebase
// Menggunakan pola singleton yang lebih tangguh untuk mencegah 'app/duplicate-app'
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

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

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Pastikan firebaseConfig Anda sudah didefinisikan di sini
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

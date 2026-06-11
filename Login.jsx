import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from './config'; // Import db
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { LogIn, Mail } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [heroSlide, setHeroSlide] = useState(null); // State untuk data hero slide

  // Fetch hero slide data
  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setHeroSlide({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setHeroSlide(null); // Reset if no slides
      }
    }, (err) => {
      console.error("Error fetching hero slide for login page:", err);
      // Fallback to default if there's an error
      setHeroSlide(null);
    });
    return () => unsubscribe();
  }, []);

  // Cek apakah API Key tersedia
  const isConfigReady = 
    import.meta.env.VITE_FIREBASE_API_KEY && 
    !import.meta.env.VITE_FIREBASE_API_KEY.includes('your_firebase_api_key');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isConfigReady) {
      setError('Firebase API Key tidak ditemukan. Pastikan file .env sudah benar atau Environment Variables di Vercel sudah diatur.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error code:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password yang Anda masukkan salah.');
      } else if (err.code === 'auth/invalid-api-key' || err.message.includes('api-key-not-valid')) {
        setError('API Key Firebase tidak valid. Periksa kembali konfigurasi di Vercel/Firebase.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login. Akun ditangguhkan sementara.');
      } else {
        setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    if (!isConfigReady) {
      setError('Konfigurasi Google Login belum siap.');
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Gagal masuk dengan Google. Periksa izin domain di Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Bagian Hero Banner (Slide Layar Pertama) */}
      <div className="flex flex-col lg:w-1/2 bg-emerald-900 items-center justify-center p-12 text-white relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center lg:text-left">
          <div className="w-20 h-20 bg-emerald-800 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-2xl border border-emerald-700">
            <LogIn className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Dashboard Admin <span className="text-emerald-400">IMAMA</span>
          </h1>
          <p className={`text-emerald-100 text-lg mb-8 leading-relaxed opacity-90 ${heroSlide?.subtitleFont || 'font-serif'} ${heroSlide?.subtitleItalic ? 'italic' : ''}`}>
            {heroSlide?.subtitle || 'Selamat datang kembali! Kelola informasi, struktur organisasi, dan konten website IMAMA UNESA dengan mudah dalam satu tempat.'}
          </p>
        </div>
      </div>

      {/* Form Login */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Admin</h2>
            <p className="text-gray-500">Masuk untuk mengelola konten website.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              <p className="font-bold flex items-center gap-2">⚠️ Perhatian</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
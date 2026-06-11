import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, firebaseConfig } from './config';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { LogIn, Github, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error code:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email atau password yang Anda masukkan salah.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan login. Akun ditangguhkan sementara.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Metode login Email/Password belum diaktifkan di Firebase Console.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup diblokir oleh browser. Silakan aktifkan izin popup.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Metode login Google belum diaktifkan di Firebase Console.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain ini belum terdaftar di Authorized Domains Firebase Console.');
      } else {
        setError('Gagal masuk dengan Google. Pastikan koneksi stabil.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Bagian Slide Layar Pertama (Hero Section) */}
      <div className="lg:flex lg:w-1/2 bg-emerald-900 items-center justify-center p-12 text-white relative overflow-hidden">
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
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed opacity-90">
            Selamat datang kembali! Kelola informasi, struktur organisasi, dan konten website IMAMA UNESA dengan mudah dalam satu tempat.
          </p>
          <div className="flex items-center space-x-4 justify-center lg:justify-start">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-900 bg-emerald-800 flex items-center justify-center text-xs font-bold">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-sm text-emerald-200">Terintegrasi dengan Firebase Cloud</span>
          </div>
        </div>
      </div>

      {/* Form Login */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Admin</h2>
            <p className="text-gray-500">Gunakan akun admin yang terdaftar untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-shake">
              <p className="font-bold">Gagal Masuk</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@imama.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-700/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Memproses...' : 'Masuk Dashboard'}</span>
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">Atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-3"
            >
              <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-5 h-5 grayscale opacity-70" alt="" />
              <span>Masuk dengan Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
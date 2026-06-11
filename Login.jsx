import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth, firebaseConfig } from './config';
import { LogIn } from 'lucide-react';

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
      navigate('/admin/dashboard'); // Arahkan ke halaman dashboard setelah login berhasil
    } catch (err) {
      console.error("Login error code:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        setError('Email atau password yang Anda masukkan salah.');
      } else {
        setError('Terjadi kesalahan. Pastikan akun sudah aktif di Firebase Console.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const hasRequiredConfig = Object.values(firebaseConfig).every(Boolean);

    if (!hasRequiredConfig) {
      setError('Konfigurasi Firebase belum lengkap. Isi variabel VITE_FIREBASE_* di Vercel dan Firebase Console terlebih dahulu.');
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    provider.addScope('email');
    provider.addScope('profile');

    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Google login error code:', err?.code, err);

      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          console.error('Google redirect error:', redirectError);
          setError('Popup diblokir oleh browser. Silakan izinkan popup atau ulangi dari tab yang aman.');
          return;
        }
      }

      if (err?.code === 'auth/operation-not-allowed') {
        setError('Metode login Google belum diaktifkan di Firebase Console.');
      } else if (err?.code === 'auth/invalid-credential') {
        setError('Kredensial Google tidak valid. Coba lagi dalam beberapa saat.');
      } else {
        setError('Gagal masuk dengan Google. Pastikan domain auth sudah terdaftar di Firebase Console dan koneksi internet stabil.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-900 px-6 pt-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border-4 border-emerald-800/20">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-700">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-emerald-900">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1 italic">Khusus Pengurus IMAMA UNESA</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Admin"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition disabled:opacity-50 shadow-lg shadow-emerald-900/20"
          >
            {loading ? 'Mencoba Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full border-t border-gray-200"></div>
            <span className="bg-white px-4 text-gray-400 text-[10px] font-bold uppercase tracking-tighter absolute">Atau</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 bg-white text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-50 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Masuk dengan Akun Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
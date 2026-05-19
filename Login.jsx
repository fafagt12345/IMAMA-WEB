import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './config';
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
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Google login error:", err);
      setError('Gagal masuk dengan Google.');
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
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="admin@imama.org"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 disabled:bg-gray-300"
          >
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t w-full border-gray-200"></div>
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
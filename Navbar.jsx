import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from './config';
import { signOut } from 'firebase/auth';
import { MoreHorizontal, X, User, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang', path: '/tentang' },
  { name: 'Struktur', path: '/struktur' },
  { name: 'Event', path: '/events' },
  { name: 'Program', path: '/program-kerja' },
  { name: 'Galeri', path: '/galeri' },
  { name: 'Kontak', path: '/kontak' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className={`fixed z-50 w-full transition-all duration-300 ${isScrolled || isOpen ? 'bg-white/95 py-3 shadow-lg shadow-emerald-100/70 backdrop-blur-xl' : 'bg-transparent py-4'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className={`text-2xl font-black tracking-tight transition-colors ${isScrolled || isOpen ? 'text-emerald-900' : 'text-white'}`}>
          IMAMA UNESA
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-emerald-500 ${location.pathname === link.path ? 'text-emerald-600' : isScrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link to="/admin/dashboard" className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100">
              <span className="inline-flex items-center gap-1"><User size={16} /> Admin</span>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buka menu utama"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${isScrolled || isOpen ? 'border-emerald-100 bg-white text-emerald-900 shadow-md' : 'border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md'}`}
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {isOpen && (
        <>
          <button type="button" aria-label="Tutup menu" className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[88vw] flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600">Menu utama</p>
                <h3 className="text-lg font-bold text-emerald-950">IMAMA UNESA</h3>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100" aria-label="Tutup menu">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {user && (
                <div className="mb-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Akses admin</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-emerald-900">Halo, {user.displayName || user.email || 'Admin'}</span>
                    <button onClick={handleLogout} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50">
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${location.pathname === link.path ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {link.name}
                    <span className="text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 p-5">
              {!user ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block rounded-2xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-800">
                  Login Admin
                </Link>
              ) : (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
                  Ke Panel Admin
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </nav>
  );
};

export default Navbar;
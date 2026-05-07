import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import { Menu, X, User, LogOut } from 'lucide-react';

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
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Struktur', path: '/struktur' },
    { name: 'Berita', path: '/berita' },
    { name: 'Program', path: '/program-kerja' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || isOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className={`text-2xl font-bold transition-colors ${isScrolled || isOpen ? 'text-emerald-900' : 'text-white'}`}>
          IMAMA UNESA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`font-medium transition-colors hover:text-emerald-500 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center space-x-4 border-l pl-6 border-gray-300">
              <Link to="/admin/dashboard" className="text-emerald-600 font-semibold flex items-center gap-1">
                <User size={18} /> Admin
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className={`px-5 py-2 rounded-full font-semibold transition ${isScrolled ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900'}`}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-emerald-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? 'text-emerald-900' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t mt-3 flex flex-col p-6 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-gray-700 font-medium text-lg border-b pb-2 italic">{link.name}</Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
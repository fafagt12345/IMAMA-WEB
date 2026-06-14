import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Image,
  Users,
  Settings,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { auth } from './config';
import { signOut } from 'firebase/auth';

const AdminSidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/admin/events', icon: <Calendar size={20} />, label: 'Event & Lomba' },
    { path: '/admin/hero', icon: <Image size={20} />, label: 'Hero Banner' },
    { path: '/admin/structure', icon: <Users size={20} />, label: 'Struktur' },
    { path: '/admin/departments', icon: <Settings size={20} />, label: 'Departemen' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="md:hidden fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-emerald-900/95 px-4 py-3 text-white shadow-lg backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-100">IMAMA</p>
          <p className="text-sm font-semibold">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="rounded-xl border border-emerald-700 bg-emerald-800/90 p-2 transition hover:bg-emerald-700"
          aria-label="Buka menu admin"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 md:hidden"
          aria-label="Tutup menu"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-full flex-col border-r border-emerald-800 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-2xl transition-all duration-300 md:flex ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="flex items-center justify-between border-b border-emerald-800/80 px-4 py-4">
          {!isCollapsed ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-200">IMAMA</p>
              <p className="text-lg font-semibold">Admin</p>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800/80 text-emerald-100">I</div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="rounded-xl border border-emerald-800 bg-emerald-800/90 p-2 text-emerald-100 transition hover:bg-emerald-700"
            aria-label="Collapse sidebar"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center rounded-2xl px-3 py-3 transition ${
                  active
                    ? 'bg-emerald-700/90 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-emerald-100 hover:bg-emerald-800/90 hover:text-white'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-emerald-800/80 p-4 text-emerald-100">
          <div className="mb-3 rounded-2xl border border-emerald-800/80 bg-emerald-900/70 p-3 text-xs text-emerald-100/90">
            <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-50">
              <ShieldCheck size={14} /> Panel Admin
            </div>
            <p className="leading-5">Akses aman untuk mengelola konten website IMAMA tanpa mengubah sistem login yang berjalan.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center rounded-2xl border border-emerald-800/80 bg-emerald-900/80 px-3 py-2 text-sm text-emerald-100 transition hover:bg-emerald-800 hover:text-white"
          >
            <LogOut size={16} />
            {!isCollapsed && <span className="ml-2">Keluar Panel</span>}
          </button>
        </div>
      </aside>

      <aside
        className={`fixed left-0 right-0 top-16 z-40 rounded-b-3xl border border-emerald-800 bg-emerald-900 text-white shadow-2xl transition-all duration-300 md:hidden ${
          isMobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center rounded-2xl px-3 py-3 text-sm transition ${
                location.pathname === item.path
                  ? 'bg-emerald-700/90 text-white'
                  : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center rounded-2xl border border-emerald-800 bg-emerald-800/90 px-3 py-3 text-sm text-red-100 transition hover:bg-emerald-700"
          >
            <LogOut size={16} />
            <span className="ml-3">Keluar</span>
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 md:ml-72 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'} pt-16 md:pt-0`}>
        <div className="min-h-screen p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminSidebar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiMoreVertical, FiHome, FiCalendar, FiImage, FiUsers, 
  FiMessageSquare, FiLogOut, FiSettings, FiChevronDown 
} from 'react-icons/fi';
import { auth } from './config';
import { signOut } from 'firebase/auth';

const AdminSidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/events', icon: <FiCalendar />, label: 'Event & Lomba' },
    { path: '/admin/hero', icon: <FiImage />, label: 'Hero Banner' },
    { path: '/admin/structure', icon: <FiUsers />, label: 'Struktur' },
    { path: '/admin/departments', icon: <FiSettings />, label: 'Departemen' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-emerald-900 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } fixed h-full z-50`}
      >
        <div className="p-4 flex items-center justify-between border-b border-emerald-800">
          {!isCollapsed && <span className="font-bold text-xl tracking-wider">IMAMA Admin</span>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
          >
            <FiMoreVertical size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-emerald-700 text-white' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Login/Admin Access Tersembunyi di Bawah */}
        <div className="p-4 border-t border-emerald-800">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-emerald-300 hover:text-white transition-colors"
          >
            <FiLogOut size={20} />
            {!isCollapsed && <span className="ml-3 text-sm">Keluar Panel</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Navbar (Top Bar) */}
      <div className="md:hidden fixed top-0 w-full bg-emerald-900 text-white p-4 flex justify-between items-center z-50">
        <span className="font-bold">IMAMA WEB</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <FiMoreVertical size={24} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-emerald-800 text-white shadow-xl z-40 animate-slide-down">
          <div className="flex flex-col p-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center p-2 border-b border-emerald-700"
              >
                {item.icon} <span className="ml-3">{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center p-2 text-red-300">
              <FiLogOut /> <span className="ml-3">Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        } pt-20 md:pt-0`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminSidebar;
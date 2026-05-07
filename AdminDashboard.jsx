import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from './hooks/useFetch';
import { Newspaper, Users, Image as ImageIcon, Info, Briefcase, Phone } from 'lucide-react';

const AdminDashboard = () => {
  const { data: news } = useFetch('news');
  const { data: members } = useFetch('members');
  const { data: gallery } = useFetch('gallery');
  const { data: programs } = useFetch('programs');
  const { data: departments } = useFetch('departments');

  const stats = [
    { label: 'Total Berita', count: news.length, icon: <Newspaper />, color: 'bg-blue-500' },
    { label: 'Total Pengurus', count: members.length, icon: <Users />, color: 'bg-emerald-500' },
    { label: 'Total Foto', count: gallery.length, icon: <ImageIcon />, color: 'bg-purple-500' },
    { label: 'Total Program', count: programs.length, icon: <Briefcase />, color: 'bg-orange-500' },
    { label: 'Departemen', count: departments.length, icon: <Info />, color: 'bg-cyan-500' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-emerald-900">Dashboard Admin</h2>
        <p className="text-gray-600 mt-2 text-lg italic font-light">Ringkasan data organisasi IMAMA UNESA secara realtime.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              {React.cloneElement(stat.icon, { size: 24 })}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-6 text-emerald-800 uppercase tracking-wider">Manajemen Konten</h3>
      <p className="text-gray-700 mb-6">Selamat datang di dashboard admin IMAMA UNESA. Pilih menu di bawah untuk mengelola konten website Anda.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/news" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Newspaper /> Kelola Berita
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Update warta dan kegiatan terbaru IMAMA.</p>
        </Link>

        <Link to="/admin/structure" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Users /> Kelola Pengurus
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Atur departemen dan data anggota aktif.</p>
        </Link>

        <Link to="/admin/gallery" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <ImageIcon /> Kelola Galeri
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Upload dokumentasi kegiatan organisasi.</p>
        </Link>

        <Link to="/admin/about" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Info /> Kelola Tentang
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Edit sejarah, visi misi, dan filosofi logo.</p>
        </Link>

        <Link to="/admin/programs" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Briefcase /> Kelola Program
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Atur program kerja yang sedang dijalankan.</p>
        </Link>

        <Link to="/admin/contact" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Phone /> Kelola Kontak
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Update nomor WA, Email, dan link Sosmed.</p>
        </Link>

        {/* Tambahkan link ke halaman manajemen lainnya di sini */}
      </div>
    </div>
  );
};

export default AdminDashboard;
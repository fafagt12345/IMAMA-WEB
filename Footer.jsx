import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-emerald-900 pb-12 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 italic tracking-tight">IMAMA UNESA</h2>
          <p className="text-emerald-100/60 leading-relaxed text-sm">
            Ikatan Mahasiswa Magetan Universitas Negeri Surabaya. Wadah solidaritas mahasiswa perantauan asal Magetan yang berkomitmen membangun sinergi dan prestasi.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-6 text-emerald-400 uppercase tracking-widest">Akses Cepat</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/tentang" className="hover:text-emerald-400 transition">Tentang Kami</Link></li>
            <li><Link to="/struktur" className="hover:text-emerald-400 transition">Struktur Pengurus</Link></li>
            <li><Link to="/berita" className="hover:text-emerald-400 transition">Warta IMAMA</Link></li>
            <li><Link to="/galeri" className="hover:text-emerald-400 transition">Galeri Dokumentasi</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-6 text-emerald-400 uppercase tracking-widest">Magetan Kumandang</h3>
          <p className="text-emerald-100/60 leading-relaxed text-sm italic">
            "Saling merangkul dalam kebersamaan, berkarya untuk tanah kelahiran."
          </p>
          <div className="mt-6 flex gap-4">
             {/* Ikon sosial media kecil bisa ditaruh di sini */}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 flex flex-col md:row justify-between items-center gap-4 text-xs text-emerald-100/40">
        <p>© {new Date().getFullYear()} IMAMA UNESA. All Rights Reserved.</p>
        <p>Developed with ❤️ by <span className="text-emerald-400 font-semibold italic">IMAMA Tech Team</span></p>
      </div>
    </footer>
  );
};

export default Footer;
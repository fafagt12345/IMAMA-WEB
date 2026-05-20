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
        <Link to="/admin/structure" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <Users /> Kelola Pengurus
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Atur departemen dan data anggota aktif.</p>
        </Link>

...
            <LayoutGrid /> Kelola Departemen
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Atur nama-nama departemen organisasi.</p>
        </Link>

        <Link to="/admin/about" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <LayoutGrid /> Kelola Visi & Misi
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Ubah konten visi dan misi pada halaman Tentang Kami.</p>
        </Link>

        <Link to="/admin/hero" className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
          <div className="flex items-center gap-4 text-emerald-700 font-bold text-lg">
            <ImageIcon /> Kelola Hero Banner
          </div>
          <p className="text-gray-500 text-xs mt-2 italic">Atur gambar dan teks promosi di halaman depan.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
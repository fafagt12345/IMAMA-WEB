import React, { useState, useEffect, useMemo } from 'react';
import { db } from './config';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ShoppingCart, Instagram, Search, Tag } from 'lucide-react';

const Merchandise = () => {
  const [products, setProducts] = useState([]);
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const q = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const contactRef = doc(db, 'settings', 'contact');
    const unsubscribeContact = onSnapshot(contactRef, (docSnap) => {
      if (docSnap.exists()) setContactInfo(docSnap.data());
    });

    return () => {
      unsubscribeProducts();
      unsubscribeContact();
    };
  }, []);

  const categories = useMemo(() => ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const whatsappNumber = contactInfo.phone || '6281234567890'; // Default number
  const whatsappMessage = `Halo Admin Ekraf IMAMA,\nSaya ingin memesan merchandise IMAMA.\nMohon informasi mengenai stok dan cara pemesanannya.\nTerima kasih.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Merchandise IMAMA</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dukung kegiatan IMAMA dengan menggunakan merchandise resmi yang dikelola oleh Divisi Ekraf.
          </p>
        </div>

        {/* Filter and Search */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Cari produk..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? <div className="text-center py-10">Memuat produk...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img src={p.imageUrl || 'https://via.placeholder.com/400x400'} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white rounded-full ${p.stockStatus === 'Tersedia' ? 'bg-green-500' : 'bg-red-500'}`}>{p.stockStatus}</div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{p.category}</p>
                  <h3 className="text-lg font-bold text-emerald-900 mt-1 mb-2 truncate">{p.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{p.description}</p>
                  <div className="text-xl font-extrabold text-emerald-800 mb-4">Rp{Number(p.price).toLocaleString('id-ID')}</div>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition">
                    Pesan Sekarang
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {filteredProducts.length === 0 && !loading && <div className="text-center py-20 text-gray-500 italic">Produk tidak ditemukan.</div>}

        {/* Ordering Info */}
        <div className="mt-20 p-8 bg-emerald-900 text-white rounded-3xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Informasi Pemesanan</h3>
            <p className="text-emerald-200 mb-6">Seluruh merchandise resmi dikelola oleh Divisi Ekonomi Kreatif (Ekraf) IMAMA UNESA.</p>
            {contactInfo.instagram_ekraf && (
              <a href={`https://instagram.com/${contactInfo.instagram_ekraf}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl mb-4">
                <Instagram className="text-pink-400" />
                <span className="font-semibold">@{contactInfo.instagram_ekraf}</span>
              </a>
            )}
          </div>
          <div className="text-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
              Pesan Merchandise via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;
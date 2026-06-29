import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Phone, Mail, Instagram, Youtube, Send, User, ShoppingBag } from 'lucide-react';

// Komponen SVG untuk logo TikTok
const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const Contact = () => {
  const [contact, setContact] = useState({});
  const [message, setMessage] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'contact');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContact(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk mengirim pesan bisa ditambahkan di sini
    alert('Fitur kirim pesan belum diimplementasikan.');
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Kontak */}
          <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg flex flex-col">
            <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
            <p className="text-emerald-200 mb-8">
              Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami melalui detail di bawah ini atau kirim pesan langsung.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-emerald-200">{loading ? 'Memuat...' : (contact.email || 'Informasi tidak tersedia')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold">Telepon / WA</h4>
                  <p className="text-emerald-200">{loading ? 'Memuat...' : (contact.phone || 'Informasi tidak tersedia')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <User className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold">Ketua IMAMA</h4>
                  <p className="text-emerald-200">{loading ? 'Memuat...' : (contact.ketua || 'Informasi tidak tersedia')}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <User className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold">Wakil Ketua IMAMA</h4>
                  <p className="text-emerald-200">{loading ? 'Memuat...' : (contact.wakil || 'Informasi tidak tersedia')}</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-auto pt-8 border-t border-emerald-800/50 mt-8">
              <h4 className="font-bold mb-4">Temukan Kami di Sosial Media</h4>
              <div className="flex gap-4">
                {contact.instagram && (<a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white" title="Instagram"><Instagram /></a>)}
                {contact.instagram_ekraf && (<a href={`https://instagram.com/${contact.instagram_ekraf}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white" title="Instagram Ekraf"><ShoppingBag /></a>)}
                {contact.tiktok && (<a href={`https://tiktok.com/@${contact.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white" title="TikTok"><TiktokIcon /></a>)}
                {contact.youtube && (<a href={`https://youtube.com/${contact.youtube}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white"><Youtube /></a>)}
              </div>
            </div>
          </div>

          {/* Form Pesan */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label className="font-bold text-gray-700">Nama Anda</label><input type="text" placeholder="Nama Lengkap" className="w-full p-3 mt-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="font-bold text-gray-700">Email Anda</label><input type="email" placeholder="email@anda.com" className="w-full p-3 mt-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="font-bold text-gray-700">Pesan</label><textarea placeholder="Tulis pesan Anda di sini..." className="w-full p-3 mt-2 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-32"></textarea></div>
              <button type="submit" className="w-full bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors">
                <Send size={18} /> Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
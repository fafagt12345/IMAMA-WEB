import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Phone, Mail, MapPin, Instagram, Youtube, Send, User, MessageSquare } from 'lucide-react';

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
                <MapPin className="text-emerald-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold">Alamat</h4>
                  <p className="text-emerald-200">{loading ? 'Memuat...' : (contact.address || 'Ketintang, Surabaya')}</p>
                </div>
              </div>
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
                {contact.instagram_ekraf && (<a href={`https://instagram.com/${contact.instagram_ekraf}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white" title="Instagram Ekraf"><Instagram /></a>)}
                {contact.tiktok && (<a href={`https://tiktok.com/@${contact.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-white"><Tiktok /></a>)}
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
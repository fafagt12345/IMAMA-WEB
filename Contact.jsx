import React, { useState, useEffect } from 'react';
import { db } from './config';
import { doc, onSnapshot } from 'firebase/firestore';
import { Phone, Mail, MapPin, Instagram, Youtube, Tiktok, Send, User } from 'lucide-react';

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
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Memuat Kontak...</div>;

  const mapsUrl = normalizeMapsUrl(contact?.mapsUrl || '');

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Hubungi Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic font-light">Kami terbuka untuk kolaborasi, saran, dan pertanyaan seputar IMAMA UNESA.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info Cards */}
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-5 border border-emerald-100">
              <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">WhatsApp</p>
                <a href={`https://wa.me/${contact?.whatsapp}`} target="_blank" className="text-lg font-bold text-emerald-900 hover:text-emerald-700 transition">+{contact?.whatsapp}</a>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-5 border border-emerald-100">
              <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <Instagram size={24} />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Instagram</p>
                <a href={`https://instagram.com/${contact?.instagram}`} target="_blank" className="text-lg font-bold text-emerald-900 hover:text-emerald-700 transition">@{contact?.instagram}</a>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-5 border border-emerald-100">
              <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Email</p>
                <p className="text-lg font-bold text-emerald-900">{contact?.email}</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-5 border border-emerald-100">
              <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Sekretariat</p>
                <p className="text-gray-700 text-sm leading-relaxed">{contact?.address}</p>
              </div>
            </div>
          </motion.div>

          {/* Maps Embed */}
          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative min-h-[280px] h-[320px] w-full rounded-[2rem] border-8 border-white shadow-2xl md:h-[450px]">
            {mapsUrl ? (
              <iframe
                src={mapsUrl}
                title="Peta lokasi IMAMA UNESA"
                className="h-full w-full rounded-[1.4rem]"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-emerald-100 px-4 text-center italic text-emerald-900">Peta tidak tersedia. Pastikan link Google Maps yang disimpan adalah URL embed yang valid.</div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
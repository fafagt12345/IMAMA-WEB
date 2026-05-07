import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Phone, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'contact'));
      if (docSnap.exists()) setContact(docSnap.data());
      setLoading(false);
    };
    fetchContact();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Memuat Kontak...</div>;

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
          <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
            {contact?.mapsUrl ? (
              <iframe src={contact.mapsUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            ) : (
              <div className="w-full h-full bg-emerald-100 flex items-center justify-center italic text-emerald-900">Peta tidak tersedia</div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
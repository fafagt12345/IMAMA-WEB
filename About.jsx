import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Flag, History, Award } from 'lucide-react';
import { db } from './firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      const docRef = doc(db, 'settings', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutData(docSnap.data());
      }
      setLoading(false);
    };
    fetchAbout();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-emerald-900 mb-6"
        >
          Mengenal Lebih Dekat <br /> <span className="text-emerald-600">IMAMA UNESA</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed italic"
        >
          "Wadah persaudaraan, pengembangan diri, dan pengabdian bagi mahasiswa Magetan di Universitas Negeri Surabaya."
        </motion.p>
      </section>

      {/* Sejarah Section */}
      <section className="bg-emerald-50 py-20 mb-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6 text-emerald-700 font-bold uppercase tracking-widest">
              <History size={24} />
              <span>Jejak Langkah</span>
            </div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Sejarah Berdirinya IMAMA</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="whitespace-pre-wrap">
                {aboutData?.history || "Sejarah sedang diperbarui oleh admin."}
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden shadow-2xl h-80 bg-emerald-200 flex items-center justify-center"
          >
             {/* Tempatkan foto dokumentasi sejarah di sini */}
             {aboutData?.logoUrl ? (
               <img src={aboutData.logoUrl} alt="Logo IMAMA" className="h-64 object-contain" />
             ) : (
               <Award size={80} className="text-emerald-700 opacity-20" />
             )}
          </motion.div>
        </div>
      </section>

      {/* Filosofi Logo */}
      <section className="container mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-emerald-900 text-center mb-16 uppercase tracking-widest">Filosofi Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(aboutData?.philosophy || []).map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white border border-emerald-100 rounded-3xl shadow-sm hover:shadow-xl transition-all text-center"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-emerald-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
          >
            <Target className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 italic">
                <Target /> Visi
              </h2>
              <p className="text-lg text-emerald-50 leading-relaxed font-light">
                Mewujudkan IMAMA UNESA sebagai organisasi kedaerahan yang unggul, adaptif, dan kontributif dalam membentuk karakter mahasiswa yang berintegritas serta berjiwa sosial tinggi demi kemajuan Magetan.
              </p>
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-10 border-2 border-emerald-900 rounded-[3rem] shadow-lg"
          >
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3 italic">
              <Flag /> Misi
            </h2>
            <ul className="space-y-4">
              {[
                "Mempererat tali silaturahmi antar mahasiswa Magetan di UNESA.",
                "Menyelenggarakan kegiatan pengembangan minat dan bakat anggota.",
                "Berperan aktif dalam kegiatan sosial dan promosi daerah Magetan.",
                "Menjalin kolaborasi strategis dengan organisasi kedaerahan lainnya."
              ].map((misi, idx) => (
                <motion.li key={idx} variants={itemVariants} className="flex gap-4 text-gray-700">
                  <div className="min-w-[24px] h-6 w-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                  <span>{misi}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
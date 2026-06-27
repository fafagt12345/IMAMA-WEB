import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Target, BookOpen, Lightbulb } from 'lucide-react';
import { db } from './config';
import { doc, onSnapshot } from 'firebase/firestore';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'about');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAboutData(docSnap.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data 'Tentang':", error);
      setLoading(false); // Pastikan loading berhenti jika terjadi error
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 pt-20">
        <p className="text-emerald-700 text-lg font-semibold">Memuat informasi...</p>
      </div>
    );
  }

  // Default data jika tidak ada di Firestore
  const defaultVision = "Mewujudkan IMAMA UNESA sebagai wadah mahasiswa Magetan yang unggul dan kontributif.";
  const defaultMission = [
    "Mempererat tali silaturahmi antar mahasiswa Magetan di UNESA.",
    "Menyelenggarakan kegiatan pengembangan minat dan bakat anggota.",
    "Berperan aktif dalam kegiatan sosial dan promosi daerah Magetan.",
    "Menjalin kolaborasi strategis dengan organisasi kedaerahan lainnya."
  ];
  const defaultHistory = "IMAMA UNESA adalah organisasi kedaerahan yang didirikan untuk menyatukan mahasiswa Magetan di Universitas Negeri Surabaya. Sejak awal, kami berkomitmen untuk menjadi wadah pengembangan diri dan kontribusi sosial bagi masyarakat Magetan.";
  const defaultPhilosophy = [
    { title: "Bentuk Lingkaran", desc: "Melambangkan persatuan dan kesatuan yang tak terputus antar anggota." },
    { title: "Warna Hijau", desc: "Mencerminkan kesuburan, pertumbuhan, dan harapan untuk masa depan yang cerah." },
  ];

  const vision = aboutData?.vision || defaultVision;
  const mission = aboutData?.mission?.length > 0 ? aboutData.mission : defaultMission;
  const history = aboutData?.history || defaultHistory;
  const philosophy = aboutData?.philosophy?.length > 0 ? aboutData.philosophy : defaultPhilosophy;
  const logoUrl = aboutData?.logoUrl || "https://via.placeholder.com/150?text=Logo+IMAMA";

  return (
    <section id="about" className="py-20 bg-white pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-emerald-900 mb-12">Tentang IMAMA UNESA</h1>

        {/* Visi & Misi Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Visi */}
          <div className="p-10 bg-emerald-900 rounded-[3rem] shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target /> Visi
            </h2>
            <p className="text-lg leading-relaxed font-light whitespace-pre-wrap">{vision}</p>
          </div>

          {/* Misi */}
          <motion.div
            variants={containerVariants}
            className="p-10 border-2 border-emerald-900 rounded-[3rem] shadow-lg"
          >
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <Flag /> Misi
            </h2>
            <ul className="space-y-4">
              {mission.map((misi, idx) => (
                <motion.li key={idx} variants={itemVariants} className="flex gap-4 text-gray-700">
                  <div className="min-w-[24px] h-6 w-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="whitespace-pre-wrap">{misi}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Sejarah & Logo Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <BookOpen /> Sejarah
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{history}</p>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-center">
            <img src={logoUrl} alt="Logo IMAMA UNESA" className="max-w-xs h-auto rounded-full shadow-lg border-4 border-emerald-100" />
          </motion.div>
        </div>

        {/* Filosofi Logo Section */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="p-10 border-2 border-emerald-900 rounded-[3rem] shadow-lg">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <Lightbulb /> Filosofi Logo
          </h2>
          <ul className="space-y-4">
            {philosophy.map((item, idx) => (
              <motion.li key={idx} variants={itemVariants} className="flex gap-4 text-gray-700">
                <div className="min-w-[24px] h-6 w-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm whitespace-pre-wrap">{item.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
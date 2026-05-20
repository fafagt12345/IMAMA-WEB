import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flag, Target } from 'lucide-react';
import { db } from './config';
import { doc, onSnapshot } from 'firebase/firestore';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'about'), (doc) => {
      if (doc.exists()) setAboutData(doc.data());
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

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Visi */}
          <div className="p-10 bg-emerald-900 rounded-[3rem] shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 italic">
              <Target /> Visi
            </h2>
            <p className="text-lg leading-relaxed font-light">
              {aboutData?.vision || "Mewujudkan IMAMA UNESA sebagai wadah mahasiswa Magetan yang unggul dan kontributif."}
            </p>
          </div>

          {/* Misi */}
          <motion.div
            variants={containerVariants}
            className="p-10 border-2 border-emerald-900 rounded-[3rem] shadow-lg"
          >
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3 italic">
              <Flag /> Misi
            </h2>
            <ul className="space-y-4">
              {(aboutData?.mission?.length > 0 ? aboutData.mission : [
                "Mempererat tali silaturahmi antar mahasiswa Magetan di UNESA.",
                "Menyelenggarakan kegiatan pengembangan minat dan bakat anggota.",
                "Berperan aktif dalam kegiatan sosial dan promosi daerah Magetan.",
                "Menjalin kolaborasi strategis dengan organisasi kedaerahan lainnya."
              ]).map((misi, idx) => (
                <motion.li key={idx} variants={itemVariants} className="flex gap-4 text-gray-700">
                  <div className="min-w-[24px] h-6 w-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span>{misi}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
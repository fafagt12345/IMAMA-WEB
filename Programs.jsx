import React from 'react';
import { useFetch } from './hooks/useFetch';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Programs = () => {
  const { data: programs, loading } = useFetch('programs', 'createdAt');

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-900 font-bold text-xl">Memuat Program Kerja...</div>;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 uppercase tracking-wider">Program Kerja IMAMA</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">Inisiatif dan kegiatan yang kami jalankan untuk anggota dan masyarakat.</p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">Belum ada program kerja yang diterbitkan.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {programs.map((program) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col hover:shadow-2xl transition-shadow"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={program.imageUrl || 'https://via.placeholder.com/600x400?text=Program+IMAMA'} 
                    alt={program.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-emerald-600 text-xs font-semibold mb-3 gap-2 uppercase tracking-widest">
                    <Briefcase size={14} />
                    Program Kerja
                  </div>
                  <h2 className="text-xl font-bold text-emerald-900 mb-3 line-clamp-2 leading-tight">
                    {program.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>
                  {/* Jika ada halaman detail program, bisa ditambahkan link di sini */}
                  {/* <div className="mt-auto">
                    <Link to={`/program/${program.id}`} className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-500 transition-colors">
                      Lihat Detail <ArrowRight size={18} />
                    </Link>
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
import React, { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Info } from 'lucide-react';

const Programs = () => {
  const { data: programs = [], loading } = useFetch('programs');
  const [selectedProg, setSelectedProg] = useState(null);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">Memuat Program Kerja...</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Program Kerja</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic font-light">
            Rangkaian agenda dan kegiatan rutin Ikatan Mahasiswa Magetan Universitas Negeri Surabaya.
          </p>
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <motion.div
                key={prog.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedProg(prog)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={prog.imageUrl || 'https://via.placeholder.com/600x400'} 
                    alt={prog.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Info className="text-white" size={32} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">{prog.name}</h3>
                  {prog.date && (
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-3 uppercase tracking-wider">
                      <Calendar size={14} />
                      {new Date(prog.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 italic">Belum ada program kerja yang ditambahkan.</div>
        )}
      </div>

      {/* Lightbox / Modal (Efek Maju ke Depan) */}
      <AnimatePresence>
        {selectedProg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProg(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setSelectedProg(null)}
              className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors p-2"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 bg-black flex items-center justify-center">
                <img 
                  src={selectedProg.imageUrl || 'https://via.placeholder.com/600x400'} 
                  alt={selectedProg.name} 
                  className="w-full h-full object-cover max-h-[50vh] md:max-h-full"
                />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
                <h2 className="text-3xl font-bold text-emerald-900 mb-3">{selectedProg.name}</h2>
                {selectedProg.date && (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-6">
                    <Calendar size={18} />
                    {new Date(selectedProg.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
                <div className="w-12 h-1 bg-emerald-500 mb-6 rounded-full" />
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedProg.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;
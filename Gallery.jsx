import React from 'react';
import { useFetch } from './hooks/useFetch';
import { motion } from 'framer-motion';

const Gallery = () => {
  const { data: photos, loading } = useFetch('gallery', 'createdAt');

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-900 font-bold text-xl">Memuat Galeri...</div>;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 uppercase tracking-wider">Galeri Dokumentasi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">Momen-momen berharga dalam perjalanan IMAMA UNESA.</p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="break-inside-avoid">
              <img src={p.imageUrl} className="w-full rounded-2xl shadow-md hover:shadow-xl transition-shadow border-2 border-white" alt={p.title} />
              <p className="text-center mt-2 text-emerald-800 font-semibold text-sm">{p.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
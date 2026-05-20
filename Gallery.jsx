import React, { useState } from 'react';
import { useFetch } from './hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Gallery = () => {
  const { data: images = [], loading } = useFetch('gallery');
  const [selectedImg, setSelectedImg] = useState(null);

  // Hanya tampilkan gambar yang status visibilitasnya aktif
  const visibleImages = images.filter(img => img.isVisible !== false);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center">Memuat Galeri...</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Galeri Kegiatan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic font-light">Dokumentasi perjalanan dan momen berharga IMAMA UNESA.</p>
        </div>

        {visibleImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleImages.map((img) => (
              <motion.div
                key={img.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImg(img)}
                className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg aspect-square group"
              >
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{img.caption}</p>
                  {img.eventDate && (
                    <p className="text-emerald-300 text-[10px] mt-1 font-semibold">{new Date(img.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 italic">Belum ada foto di galeri.</div>
        )}
      </div>

      {/* Lightbox / Modal (Efek Maju ke Depan) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-10"
          >
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors p-2"
            >
              <X size={40} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col items-center"
            >
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center">
                <img 
                  src={selectedImg.url} 
                  alt={selectedImg.caption} 
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              
              <div className="mt-6 text-center max-w-3xl">
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-lg md:text-xl font-medium leading-relaxed"
                >
                  {selectedImg.caption}
                </motion.p>
                {selectedImg.eventDate && (
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-emerald-400 text-sm mt-2 font-bold italic tracking-wide"
                  >
                    — {new Date(selectedImg.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
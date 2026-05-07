import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=1920',
    title: 'Membangun Solidaritas Mahasiswa Magetan',
    subtitle: 'Ikatan Mahasiswa Magetan Universitas Negeri Surabaya'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1920',
    title: 'Dedikasi Untuk Almamater & Daerah',
    subtitle: 'Berperan Aktif dalam Pembangunan Karakter Mahasiswa Rantau'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1920',
    title: 'Keluarga Mahasiswa Magetan di Surabaya',
    subtitle: 'Rumah Kedua untuk Seluruh Mahasiswa Asal Magetan di UNESA'
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Bergulir otomatis setiap 5 detik
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-emerald-950">
      {/* Slides Container */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Image with Blur Effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-110"
            style={{ 
              backgroundImage: `url(${slides[currentIndex].url})`,
              filter: 'blur(4px) brightness(0.5)' // Foto agak blur dan sedikit gelap agar teks menonjol
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            {slides[currentIndex].title}
          </h1>
          <p className="text-lg md:text-2xl text-emerald-50 mb-8 max-w-3xl mx-auto font-light italic">
            {slides[currentIndex].subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/20">
              Gabung IMAMA
            </button>
            <button className="border-2 border-white/50 text-white hover:bg-white hover:text-emerald-900 px-8 py-3 rounded-full font-bold transition-all">
              Lihat Kegiatan
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-emerald-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
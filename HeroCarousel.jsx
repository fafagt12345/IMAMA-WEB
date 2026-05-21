import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFetch } from './hooks/useFetch';

const HeroCarousel = () => {
  const { data: slides = [], loading } = useFetch('hero_slides');
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Bergulir otomatis setiap 5 detik
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  if (loading) return <div className="h-screen bg-emerald-950 flex items-center justify-center text-white">Memuat...</div>;
  if (slides.length === 0) return null;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-emerald-950">
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
          {/* Layer 1: Background Blur (Mengisi ruang kosong agar tidak ada bar hitam/hijau) */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40"
            style={{
              backgroundImage: `url(${slides[currentIndex].url})`,
            }}
          />

          {/* Layer 2: Main Image (Menampilkan seluruh foto tanpa terpotong) */}
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700"
            style={{ 
              backgroundImage: `url(${slides[currentIndex].url})`, 
              filter: `blur(${slides[currentIndex].blurLevel || 0}px) brightness(0.6)` 
            }}
          />

          {/* Layer 3: Dark Gradient Overlay (Memastikan teks selalu terbaca di semua perangkat) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 py-10 sm:py-20">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
            {slides[currentIndex].title}
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl text-emerald-50 mb-6 sm:mb-8 max-w-3xl mx-auto font-light italic leading-relaxed whitespace-pre-wrap">
            {slides[currentIndex].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/kontak" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/20 text-center">
              Kontak IMAMA
            </Link>
            <Link to="/program-kerja" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-emerald-900 px-8 py-3 rounded-full font-bold transition-all text-center">
              Lihat Kegiatan
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronRight size={24} className="sm:w-8 sm:h-8" />
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
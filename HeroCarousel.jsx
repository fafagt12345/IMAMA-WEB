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

  const activeSlide = slides[currentIndex] || {};
  const slideStyle = activeSlide.textSettings || {};
  const imageSrc = activeSlide.imageUrl || activeSlide.url || activeSlide.image || '';
  const titleStyle = {
    fontFamily: slideStyle.fontFamily || 'Poppins',
    fontStyle: slideStyle.fontStyle || 'normal',
    fontSize: `${slideStyle.fontSize || 54}px`,
    fontWeight: slideStyle.fontWeight || '600',
    letterSpacing: slideStyle.letterSpacing || '0px',
    lineHeight: slideStyle.lineHeight || 1.2,
    color: slideStyle.textColor || '#FFFFFF',
    textShadow: slideStyle.textShadow || '0 4px 18px rgba(0,0,0,0.35)',
    textAlign: slideStyle.textAlign || 'left',
  };
  const subtitleStyle = {
    fontFamily: slideStyle.fontFamily || 'Poppins',
    fontStyle: slideStyle.fontStyle || 'normal',
    fontSize: `${Math.max(18, (slideStyle.fontSize || 54) * 0.45)}px`,
    fontWeight: slideStyle.fontWeight || '400',
    letterSpacing: slideStyle.letterSpacing || '0px',
    lineHeight: slideStyle.lineHeight || 1.4,
    color: slideStyle.textColor || '#FFFFFF',
    textShadow: slideStyle.textShadow || '0 4px 18px rgba(0,0,0,0.35)',
    textAlign: slideStyle.textAlign || 'left',
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black select-none">
      {/* Slides Container */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {/* Layer 1: Ambient Background - Mengisi seluruh layar tanpa celah */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-50 scale-110"
            style={{
              backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
            }}
          />

          {/* Layer 2: Main Image - Menampilkan foto utuh tanpa terpotong */}
          <div 
            className="absolute inset-0 bg-contain sm:bg-cover bg-center bg-no-repeat transition-all duration-700"
            style={{ 
              backgroundImage: imageSrc ? `url(${imageSrc})` : 'none', 
              filter: `blur(${activeSlide.blurLevel || 0}px) brightness(1)` 
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Layer 3: Global Overlay - Berada di belakang teks tapi di atas gambar */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6 py-10 sm:py-20">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight" style={titleStyle}>
            {activeSlide.title}
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap" style={subtitleStyle}>
            {activeSlide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-40">
            <Link to="/kontak" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/20 text-center cursor-pointer">
              Kontak IMAMA
            </Link>
            <Link to="/program-kerja" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-emerald-900 px-8 py-3 rounded-full font-bold transition-all text-center cursor-pointer">
              Lihat Kegiatan
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 p-1 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronRight size={24} className="sm:w-8 sm:h-8" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-3">
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
import React from 'react';
import HeroCarousel from './HeroCarousel';
import About from './About';

const Home = () => {
  return (
    <main className="bg-white">
      {/* Hero Section with Automated & Manual Carousel */}
      <HeroCarousel />

      {/* Section Tentang (Sekarang digabung ke Home) */}
      <About />

    </main>
  );
};

export default Home;
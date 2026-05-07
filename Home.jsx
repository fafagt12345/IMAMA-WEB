import React from 'react';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  return (
    <main className="bg-white">
      {/* Hero Section with Automated & Manual Carousel */}
      <HeroCarousel />

      {/* Section Tentang (Contoh Ringkasan) */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 italic">Membangun Sinergi Mahasiswa Magetan</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              IMAMA UNESA hadir sebagai wadah berkumpulnya mahasiswa asal Kabupaten Magetan yang menempuh pendidikan di Universitas Negeri Surabaya. Kami berkomitmen untuk saling merangkul, menginspirasi, dan berkontribusi bagi tanah kelahiran.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
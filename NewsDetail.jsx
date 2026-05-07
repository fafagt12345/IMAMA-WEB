import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import { Calendar, ArrowLeft } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNews(docSnap.data());
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-emerald-900 font-bold">Memuat Konten...</div>;
  if (!news) return <div className="h-screen flex items-center justify-center">Berita tidak ditemukan.</div>;

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-emerald-700 font-semibold mb-8 hover:translate-x-1 transition-transform"
        >
          <ArrowLeft size={20} /> Kembali ke Berita
        </button>

        <header className="mb-10">
          <div className="flex items-center text-emerald-600 font-medium mb-4 gap-2 italic">
            <Calendar size={18} />
            {news.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 leading-tight">
            {news.title}
          </h1>
        </header>

        <div className="rounded-3xl overflow-hidden shadow-2xl mb-10 h-[300px] md:h-[500px]">
          <img 
            src={news.imageUrl || 'https://via.placeholder.com/1200x800'} 
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-emerald prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {news.content}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
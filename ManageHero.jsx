import React, { useEffect, useState } from 'react';
import { db, auth } from './config';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Edit2, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';

const FONT_OPTIONS = ['Poppins', 'Inter', 'Montserrat', 'Roboto', 'Open Sans', 'Playfair Display', 'Lora', 'Merriweather'];
const WEIGHT_OPTIONS = ['300', '400', '500', '600', '700'];
const ALIGN_OPTIONS = ['left', 'center', 'right'];
const ANIMATION_OPTIONS = ['none', 'fadeIn', 'slideUp', 'slideLeft', 'zoomIn'];

const DEFAULT_STYLE = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontSize: 54,
  fontWeight: '600',
  letterSpacing: '0px',
  lineHeight: 1.2,
  textColor: '#FFFFFF',
  textBgColor: '#000000',
  bgOpacity: 35,
  textShadow: '0 4px 18px rgba(0,0,0,0.35)',
  textAlign: 'left',
  animation: 'fadeIn',
};

const hexToRgba = (hex, opacity = 1) => {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean;
  const num = parseInt(value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const ManageHero = () => {
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [blurLevel, setBlurLevel] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textSettings, setTextSettings] = useState(DEFAULT_STYLE);
  const [fontOptionsInput, setFontOptionsInput] = useState(FONT_OPTIONS.join(', '));
  const [fontOptions, setFontOptions] = useState(FONT_OPTIONS);

  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSlides(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'hero'));
        if (snap.exists()) {
          const data = snap.data();
          const savedFonts = Array.isArray(data.fontOptions)
            ? data.fontOptions
            : typeof data.fontOptions === 'string'
              ? data.fontOptions.split(',').map((item) => item.trim()).filter(Boolean)
              : FONT_OPTIONS;
          const normalized = savedFonts.length ? savedFonts : FONT_OPTIONS;
          setFontOptions(normalized);
          setFontOptionsInput(normalized.join(', '));
        }
      } catch (error) {
        console.error('Gagal memuat daftar font hero:', error);
      }
    };

    loadSettings();
  }, []);

  const previewStyle = {
    fontFamily: textSettings.fontFamily,
    fontStyle: textSettings.fontStyle,
    fontSize: `${textSettings.fontSize}px`,
    fontWeight: textSettings.fontWeight,
    letterSpacing: textSettings.letterSpacing,
    lineHeight: textSettings.lineHeight,
    color: textSettings.textColor,
    textAlign: textSettings.textAlign,
    textShadow: textSettings.textShadow,
    animation: textSettings.animation === 'none' ? 'none' : `${textSettings.animation === 'fadeIn' ? 'fadeIn' : textSettings.animation === 'slideUp' ? 'slideUp' : textSettings.animation === 'slideLeft' ? 'slideLeft' : 'zoomIn'} 700ms ease-out`,
  };

  const previewBg = hexToRgba(textSettings.textBgColor, Number(textSettings.bgOpacity || 35) / 100);

  const handleAddOrUpdateSlide = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentPhotoUrl;
      if (photo) {
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          throw new Error('Konfigurasi Cloudinary belum diatur.');
        }

        const formData = new FormData();
        formData.append('file', photo);
        formData.append('upload_preset', UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Gagal mengunggah foto ke Cloudinary. Cek konfigurasi ENV Anda.');

        const data = await res.json();
        if (!data.secure_url) throw new Error('Cloudinary tidak mengembalikan URL gambar.');
        imageUrl = data.secure_url;
      }

      const fontList = fontOptionsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const slideData = {
        title: title || '',
        subtitle: subtitle || '',
        blurLevel: Number(blurLevel) || 0,
        imageUrl: imageUrl || '',
        textSettings: {
          ...textSettings,
          bgOpacity: Number(textSettings.bgOpacity) || 35,
        },
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.email || 'admin',
      };

      if (editingId) {
        await updateDoc(doc(db, 'hero_slides', editingId), slideData);
      } else {
        await addDoc(collection(db, 'hero_slides'), {
          ...slideData,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser?.email || 'admin',
        });
      }

      await setDoc(doc(db, 'settings', 'hero'), {
        lastModified: serverTimestamp(),
        lastModifiedBy: auth.currentUser?.email || 'admin',
        title: title || '',
        subtitle: subtitle || '',
        fontOptions: fontList.length ? fontList : FONT_OPTIONS,
      }, { merge: true });

      setFontOptions(fontList.length ? fontList : FONT_OPTIONS);

      resetForm();
      alert(editingId ? 'Slide hero berhasil diperbarui.' : 'Slide hero berhasil ditambahkan.');
    } catch (err) {
      alert('Gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus slide ini?')) {
      try {
        await deleteDoc(doc(db, 'hero_slides', id));
      } catch (err) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const handleEdit = (slide) => {
    setEditingId(slide.id);
    setTitle(slide.title || '');
    setSubtitle(slide.subtitle || '');
    setBlurLevel(Number(slide.blurLevel) || 0);
    setCurrentPhotoUrl(slide.imageUrl || '');
    setTextSettings({
      ...DEFAULT_STYLE,
      ...(slide.textSettings || {}),
      fontWeight: slide.textSettings?.fontWeight || DEFAULT_STYLE.fontWeight,
      textAlign: slide.textSettings?.textAlign || DEFAULT_STYLE.textAlign,
      animation: slide.textSettings?.animation || DEFAULT_STYLE.animation,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setBlurLevel(0);
    setPhoto(null);
    setEditingId(null);
    setCurrentPhotoUrl('');
    setTextSettings(DEFAULT_STYLE);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Hero Banner</p>
              <h1 className="text-2xl font-bold text-emerald-950">Kelola Hero Banner dengan pengaturan lengkap</h1>
              <p className="text-sm text-slate-500">Ubah font, gaya, warna, posisi, dan animasi teks lalu lihat preview langsung tanpa reload.</p>
            </div>
            {editingId && (
              <button onClick={resetForm} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                <X size={16} /> Batal Edit
              </button>
            )}
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleAddOrUpdateSlide} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Pengaturan teks & visual</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Real-time Preview</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Judul slide</span>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" required />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Subjudul slide</span>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" required />
              </label>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Font family</span>
                <select value={textSettings.fontFamily} onChange={(e) => setTextSettings((prev) => ({ ...prev, fontFamily: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  {fontOptions.map((font) => <option key={font} value={font}>{font}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Style</span>
                <select value={textSettings.fontStyle} onChange={(e) => setTextSettings((prev) => ({ ...prev, fontStyle: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Daftar font yang tersedia</p>
              <p className="mt-1 text-xs text-emerald-800">Pisahkan dengan koma. Font ini akan muncul di pilihan font hero banner.</p>
              <textarea
                value={fontOptionsInput}
                onChange={(e) => setFontOptionsInput(e.target.value)}
                rows="3"
                className="mt-3 w-full rounded-2xl border border-emerald-200 bg-white p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Ukuran teks (judul & subjudul)</span>
                <input type="number" min="16" max="96" value={textSettings.fontSize} onChange={(e) => setTextSettings((prev) => ({ ...prev, fontSize: Number(e.target.value) || 24 }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Ketebalan</span>
                <select value={textSettings.fontWeight} onChange={(e) => setTextSettings((prev) => ({ ...prev, fontWeight: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  {WEIGHT_OPTIONS.map((weight) => <option key={weight} value={weight}>{weight === '300' ? 'Light' : weight === '400' ? 'Regular' : weight === '500' ? 'Medium' : weight === '600' ? 'Semi Bold' : 'Bold'}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Warna teks</span>
                <input type="color" value={textSettings.textColor} onChange={(e) => setTextSettings((prev) => ({ ...prev, textColor: e.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 p-1 outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Posisi teks</span>
                <select value={textSettings.textAlign} onChange={(e) => setTextSettings((prev) => ({ ...prev, textAlign: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  {ALIGN_OPTIONS.map((align) => <option key={align} value={align}>{align.charAt(0).toUpperCase() + align.slice(1)}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Tingkat blur</span>
                <input type="number" min="0" max="10" value={blurLevel} onChange={(e) => setBlurLevel(Math.max(0, Math.min(10, Number(e.target.value))))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Foto latar</span>
                <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100" required={!editingId} />
              </label>
            </div>

            <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
              {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
              {loading ? 'Memproses...' : editingId ? 'Simpan Perubahan' : 'Tambah Slide Hero'}
            </button>
          </form>

          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Preview langsung</p>
              <h2 className="text-xl font-semibold text-slate-900">Tampilan teks yang akan muncul</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-3">
              <div className="relative h-56 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900">
                {currentPhotoUrl || photo ? <img src={currentPhotoUrl || (photo ? URL.createObjectURL(photo) : '')} alt="Preview hero" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-r from-emerald-900 to-emerald-700 text-sm text-emerald-100">Pilih foto untuk melihat preview</div>}
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.35), ${previewBg})` }} />
                <div className="absolute inset-0 flex items-end p-4" style={{ textAlign: textSettings.textAlign }}>
                  <div className="w-full rounded-3xl border border-white/10 p-4" style={{ backgroundColor: previewBg }}>
                    <p style={previewStyle}>{title || 'Judul hero contoh'}</p>
                    <p style={{ ...previewStyle, fontSize: `${Math.max(16, textSettings.fontSize - 8)}px`, fontWeight: '400', lineHeight: 1.4, marginTop: '0.35rem' }}>{subtitle || 'Subjudul hero contoh'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Pengaturan aktif</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-500">
                <li>Font: {textSettings.fontFamily}</li>
                <li>Style: {textSettings.fontStyle}</li>
                <li>Ukuran: {textSettings.fontSize}px</li>
                <li>Ketebalan: {textSettings.fontWeight}</li>
                <li>Posisi: {textSettings.textAlign}</li>
              </ul>
            </div>
          </aside>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Daftar slide</p>
              <h2 className="text-xl font-semibold text-slate-900">Hero banner yang tersimpan</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide) => {
              const slideStyle = slide.textSettings || DEFAULT_STYLE;
              const slideBg = hexToRgba(slideStyle.textBgColor || '#000000', Number(slideStyle.bgOpacity || 35) / 100);
              return (
                <article key={slide.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl">
                  <div className="relative h-48">
                    <img src={slide.imageUrl} alt={slide.title || 'Hero slide'} className="h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.35), ${slideBg})` }} />
                    <div className="absolute inset-0 flex items-end p-3" style={{ textAlign: slideStyle.textAlign || 'left' }}>
                      <div className="w-full rounded-2xl border border-white/10 p-3" style={{ backgroundColor: slideBg }}>
                        <p style={{ fontFamily: slideStyle.fontFamily || 'Poppins', fontStyle: slideStyle.fontStyle || 'normal', fontSize: `${slideStyle.fontSize || 54}px`, fontWeight: slideStyle.fontWeight || '600', letterSpacing: slideStyle.letterSpacing || '0px', lineHeight: slideStyle.lineHeight || 1.2, color: slideStyle.textColor || '#FFFFFF', textShadow: slideStyle.textShadow || '0 4px 18px rgba(0,0,0,0.35)', textAlign: slideStyle.textAlign || 'left' }}>{slide.title}</p>
                        <p style={{ fontFamily: slideStyle.fontFamily || 'Poppins', fontStyle: slideStyle.fontStyle || 'normal', fontSize: `${Math.max(14, (slideStyle.fontSize || 54) - 8)}px`, fontWeight: '400', lineHeight: 1.3, color: slideStyle.textColor || '#FFFFFF' }}>{slide.subtitle}</p>
                      </div>
                    </div>
                    <div className="absolute right-3 top-3 flex gap-2">
                      <button type="button" onClick={() => handleEdit(slide)} className="rounded-xl bg-white/90 p-2 text-blue-600 shadow hover:bg-white"><Edit2 size={15} /></button>
                      <button type="button" onClick={() => handleDelete(slide.id)} className="rounded-xl bg-white/90 p-2 text-red-600 shadow hover:bg-white"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{slide.title}</p>
                    <p className="mt-1 line-clamp-2 text-slate-500">{slide.subtitle}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">Blur {slide.blurLevel || 0}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageHero;

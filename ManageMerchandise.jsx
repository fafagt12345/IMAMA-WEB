import React, { useState, useEffect } from 'react';
import { db } from './config';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ShoppingCart, Trash2, Edit, Plus, Package, PackageCheck, PackageX, Star } from 'lucide-react';

const ManageMerchandise = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 'Tersedia',
    stockCount: '',
    isFeatured: false,
    imageUrl: '',
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', stockStatus: 'Tersedia', stockCount: '', isFeatured: false, imageUrl: '' });
    setPhoto(null);
    setEditingId(null);
    document.getElementById('merch-form').reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (photo) {
        const cloudFormData = new FormData();
        cloudFormData.append('file', photo);
        cloudFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: cloudFormData });
        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const productData = { ...formData, imageUrl, price: Number(formData.price), stockCount: Number(formData.stockCount), updatedAt: serverTimestamp() };

      if (editingId) {
        await updateDoc(doc(db, 'merchandise', editingId), productData);
      } else {
        await addDoc(collection(db, 'merchandise'), { ...productData, createdAt: serverTimestamp() });
      }
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini?")) {
      await deleteDoc(doc(db, 'merchandise', id));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-3"><ShoppingCart /> Kelola Merchandise</h1>
        
        <form id="merch-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100">
          <h2 className="md:col-span-2 text-lg font-semibold text-emerald-800 border-b pb-2">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          
          <input type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
          <input type="number" name="price" placeholder="Harga (misal: 100000)" value={formData.price} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
          <input type="text" name="category" placeholder="Kategori (misal: Kaos, Hoodie)" value={formData.category} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
          <input type="number" name="stockCount" placeholder="Jumlah Stok" value={formData.stockCount} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
          
          <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
            <option value="Tersedia">Tersedia</option>
            <option value="Habis">Habis</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500" />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Produk Unggulan</label>
          </div>

          <textarea name="description" placeholder="Deskripsi singkat produk..." value={formData.description} onChange={handleChange} className="md:col-span-2 w-full p-3 bg-gray-50 border rounded-xl h-24" required />
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Foto Produk</label>
            <input type="file" onChange={(e) => setPhoto(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
            {editingId && formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="w-20 h-20 mt-2 rounded-lg object-cover"/>}
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button type="submit" disabled={loading} className="bg-emerald-700 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2">
              {loading ? 'Memproses...' : (editingId ? <><Edit size={16}/> Update Produk</> : <><Plus size={16}/> Tambah Produk</>)}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold">Batal</button>}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative">
                <img src={p.imageUrl || 'https://via.placeholder.com/400x300'} className="w-full h-48 object-cover" alt={p.name} />
                {p.isFeatured && <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full"><Star size={14}/></div>}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{p.category}</p>
                <h3 className="font-bold text-emerald-900 text-lg mb-2">{p.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{p.description}</p>
                <div className="text-lg font-bold text-emerald-700 mb-4">Rp{Number(p.price).toLocaleString('id-ID')}</div>
                
                <div className="flex justify-between text-xs font-semibold border-t pt-3 mt-auto">
                   <span className={`flex items-center gap-1 ${p.stockStatus === 'Tersedia' ? 'text-green-600' : 'text-red-600'}`}>
                    {p.stockStatus === 'Tersedia' ? <PackageCheck size={14}/> : <PackageX size={14}/>}
                    {p.stockStatus} ({p.stockCount})
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 flex items-center gap-1"><Edit size={14}/> Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 flex items-center gap-1"><Trash2 size={14}/> Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMerchandise;
```

### 2. Halaman Publik: Membuat `Merchandise.jsx`

Saya akan membuat file baru `Merchandise.jsx` untuk menampilkan katalog produk kepada pengunjung.

```diff
--- /dev/null
+++ b/c:\IMAMA-WEB\Merchandise.jsx
@@ -0,0 +1,149 @@
+import React, { useState, useEffect, useMemo } from 'react';
+import { db } from './config';
+import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
+import { motion } from 'framer-motion';
+import { ShoppingCart, Instagram, Search, Tag } from 'lucide-react';
+
+const Merchandise = () => {
+  const [products, setProducts] = useState([]);
+  const [contactInfo, setContactInfo] = useState({});
+  const [loading, setLoading] = useState(true);
+  const [searchTerm, setSearchTerm] = useState('');
+  const [selectedCategory, setSelectedCategory] = useState('Semua');
+
+  useEffect(() => {
+    const q = query(collection(db, 'merchandise'), orderBy('createdAt', 'desc'));
+    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
+      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
+      setLoading(false);
+    });
+
+    const contactRef = doc(db, 'settings', 'contact');
+    const unsubscribeContact = onSnapshot(contactRef, (docSnap) => {
+      if (docSnap.exists()) setContactInfo(docSnap.data());
+    });
+
+    return () => {
+      unsubscribeProducts();
+      unsubscribeContact();
+    };
+  }, []);
+
+  const categories = useMemo(() => ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);
+
+  const filteredProducts = useMemo(() => {
+    return products.filter(p => {
+      const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
+      const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
+      return matchesCategory && matchesSearch;
+    });
+  }, [products, selectedCategory, searchTerm]);
+
+  const whatsappNumber = contactInfo.phone || '6281234567890'; // Default number
+  const whatsappMessage = `Halo Admin Ekraf IMAMA,\nSaya ingin memesan merchandise IMAMA.\nMohon informasi mengenai stok dan cara pemesanannya.\nTerima kasih.`;
+  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
+
+  return (
+    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
+      <div className="container mx-auto px-6">
+        <div className="text-center mb-12">
+          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4 tracking-tight">Merchandise IMAMA</h1>
+          <p className="text-gray-600 max-w-3xl mx-auto">
+            Dukung kegiatan IMAMA dengan menggunakan merchandise resmi yang dikelola oleh Divisi Ekraf.
+          </p>
+        </div>
+
+        {/* Filter and Search */}
+        <div className="mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
+          <div className="relative w-full md:w-1/3">
+            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
+            <input type="text" placeholder="Cari produk..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none" />
+          </div>
+          <div className="flex gap-2 overflow-x-auto pb-2">
+            {categories.map(cat => (
+              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition whitespace-nowrap ${selectedCategory === cat ? 'bg-emerald-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
+                {cat}
+              </button>
+            ))}
+          </div>
+        </div>
+
+        {/* Product Grid */}
+        {loading ? <div className="text-center py-10">Memuat produk...</div> : (
+          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
+            {filteredProducts.map(p => (
+              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100">
+                <div className="relative h-64 overflow-hidden">
+                  <img src={p.imageUrl || 'https://via.placeholder.com/400x400'} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
+                  <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold text-white rounded-full ${p.stockStatus === 'Tersedia' ? 'bg-green-500' : 'bg-red-500'}`}>{p.stockStatus}</div>
+                </div>
+                <div className="p-5">
+                  <p className="text-xs text-gray-500 uppercase tracking-wider">{p.category}</p>
+                  <h3 className="text-lg font-bold text-emerald-900 mt-1 mb-2 truncate">{p.name}</h3>
+                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{p.description}</p>
+                  <div className="text-xl font-extrabold text-emerald-800 mb-4">Rp{Number(p.price).toLocaleString('id-ID')}</div>
+                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-emerald-700 text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition">
+                    Pesan Sekarang
+                  </a>
+                </div>
+              </motion.div>
+            ))}
+          </div>
+        )}
+        {filteredProducts.length === 0 && !loading && <div className="text-center py-20 text-gray-500 italic">Produk tidak ditemukan.</div>}
+
+        {/* Ordering Info */}
+        <div className="mt-20 p-8 bg-emerald-900 text-white rounded-3xl grid md:grid-cols-2 gap-8 items-center">
+          <div>
+            <h3 className="text-2xl font-bold mb-2">Informasi Pemesanan</h3>
+            <p className="text-emerald-200 mb-6">Seluruh merchandise resmi dikelola oleh Divisi Ekonomi Kreatif (Ekraf) IMAMA UNESA.</p>
+            {contactInfo.instagram_ekraf && (
+              <a href={`https://instagram.com/${contactInfo.instagram_ekraf}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl mb-4">
+                <Instagram className="text-pink-400" />
+                <span className="font-semibold">@{contactInfo.instagram_ekraf}</span>
+              </a>
+            )}
+          </div>
+          <div className="text-center">
+            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
+              Pesan Merchandise via WhatsApp
+            </a>
+          </div>
+        </div>
+      </div>
+    </div>
+  );
+};
+
+export default Merchandise;
```

### 3. Pembaruan Sistem

Saya akan menambahkan menu dan rute baru ke dalam sistem aplikasi Anda.

#### `AdminSidebar.jsx`

Menambahkan menu "Merchandise" di sidebar admin dengan ikon `ShoppingCart`.

```diff
--- a/c:\IMAMA-WEB\AdminSidebar.jsx
+++ b/c:\IMAMA-WEB\AdminSidebar.jsx
@@ -9,6 +9,7 @@
   ShieldCheck,
   Phone,
   Info,
+  ShoppingCart,
   Briefcase,
   ImageIcon,
 } from 'lucide-react';
@@ -27,6 +28,7 @@
     { path: '/admin/programs', icon: <Briefcase size={20} />, label: 'Program Kerja' },
     { path: '/admin/gallery', icon: <ImageIcon size={20} />, label: 'Galeri' },
     { path: '/admin/structure', icon: <Users size={20} />, label: 'Struktur' },
+    { path: '/admin/merchandise', icon: <ShoppingCart size={20} />, label: 'Merchandise' },
     { path: '/admin/about', icon: <Info size={20} />, label: 'Tentang' },
     { path: '/admin/departments', icon: <Settings size={20} />, label: 'Departemen' },
     { path: '/admin/contact', icon: <Phone size={20} />, label: 'Kontak' },

```

#### `Navbar.jsx`

Menambahkan menu "Merchandise" di navbar publik.

```diff
--- a/c:\IMAMA-WEB\Navbar.jsx
+++ b/c:\IMAMA-WEB\Navbar.jsx
@@ -10,6 +10,7 @@
   { name: 'Struktur', path: '/struktur' },
   { name: 'Event', path: '/events' },
   { name: 'Program', path: '/program-kerja' },
+  { name: 'Merchandise', path: '/merchandise' },
   { name: 'Galeri', path: '/galeri' },
   { name: 'Kontak', path: '/kontak' },
 ];

```

#### `App.jsx`

Mendaftarkan rute untuk halaman admin dan publik yang baru.

```diff
--- a/c:\IMAMA-WEB\App.jsx
+++ b/c:\IMAMA-WEB\App.jsx
@@ -10,6 +10,7 @@
 import Login from './Login';
 import Gallery from './Gallery';
 import Programs from './Programs';
+import Merchandise from './Merchandise';
 import About from './About';
 import Structure from './Structure';
 import Contact from './Contact';
@@ -21,6 +22,7 @@
 import ManagePrograms from './ManagePrograms';
 import ManageGallery from './ManageGallery';
 import ManageHero from './ManageHero';
+import ManageMerchandise from './ManageMerchandise';
 import ManageAbout from './ManageAbout';
 import ManageDepartments from './ManageDepartments';
 import ManageContact from './ManageContact';
@@ -36,6 +38,7 @@
           <Route path="/events" element={<Event />} />
           <Route path="/events/:id" element={<EventDetail />} />
           <Route path="/program-kerja" element={<Programs />} />
+          <Route path="/merchandise" element={<Merchandise />} />
           <Route path="/tentang" element={<About />} /> {/* Tambahkan route untuk halaman Tentang */}
           <Route path="/struktur" element={<Structure />} />
           <Route path="/kontak" element={<Contact />} />
@@ -45,6 +48,7 @@
           <Route path="/admin/programs" element={<ProtectedRoute><AdminSidebar><ManagePrograms /></AdminSidebar></ProtectedRoute>} />
           <Route path="/admin/gallery" element={<ProtectedRoute><AdminSidebar><ManageGallery /></AdminSidebar></ProtectedRoute>} />
           <Route path="/admin/hero" element={<ProtectedRoute><AdminSidebar><ManageHero /></AdminSidebar></ProtectedRoute>} />
+          <Route path="/admin/merchandise" element={<ProtectedRoute><AdminSidebar><ManageMerchandise /></AdminSidebar></ProtectedRoute>} />
           <Route path="/admin/about" element={<ProtectedRoute><AdminSidebar><ManageAbout /></AdminSidebar></ProtectedRoute>} />
           <Route path="/admin/departments" element={<ProtectedRoute><AdminSidebar><ManageDepartments /></AdminSidebar></ProtectedRoute>} />
           <Route path="/admin/contact" element={<ProtectedRoute><AdminSidebar><ManageContact /></AdminSidebar></ProtectedRoute>} />

```

#### `AdminDashboard.jsx`

Menambahkan statistik merchandise di dashboard admin.

```diff
--- a/c:\IMAMA-WEB\AdminDashboard.jsx
+++ b/c:\IMAMA-WEB\AdminDashboard.jsx
@@ -6,6 +6,8 @@
   Sparkles,
   Trophy,
   Users2,
+  ShoppingCart,
+  Package,
 } from 'lucide-react';
 
 const formatDate = (value) => {
@@ -22,6 +24,7 @@
   const [departments, setDepartments] = useState([]);
   const [subDepartments, setSubDepartments] = useState([]);
   const [heroMeta, setHeroMeta] = useState(null);
+  const [merchandise, setMerchandise] = useState([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
@@ -38,6 +41,10 @@
       setHeroMeta(heroDoc ? { id: heroDoc.id, ...heroDoc.data() } : null);
     });
 
+    const unsubMerch = onSnapshot(collection(db, 'merchandise'), (snapshot) => {
+      setMerchandise(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
+    });
+
     setLoading(false);
 
     return () => {
@@ -45,18 +52,24 @@
       unsubDepartments();
       unsubMembers();
       unsubHero();
+      unsubMerch();
     };
   }, []);
 
   const stats = useMemo(() => {
     const totalEvents = events.length;
     const totalLomba = events.filter((item) => String(item.type || '').toLowerCase() === 'lomba').length;
+    const availableMerch = merchandise.filter(p => p.stockStatus === 'Tersedia').length;
     return {
       totalDepartments: departments.length,
       totalSubDepartments: subDepartments.length,
       totalEvents,
       totalLomba,
+      totalMerchandise: merchandise.length,
+      availableMerchandise: availableMerch,
     };
-  }, [departments.length, events, subDepartments.length]);
+  }, [departments.length, events, subDepartments.length, merchandise]);
 
   const latestEvent = events[0] || null;
   const latestLomba = events.find((item) => String(item.type || '').toLowerCase() === 'lomba') || null;
@@ -89,11 +102,13 @@
       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
         {[
           { label: 'Total Departemen', value: stats.totalDepartments, icon: <Building2 size={22} />, tone: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700' },
-          { label: 'Total Sub Departemen', value: stats.totalSubDepartments, icon: <Users2 size={22} />, tone: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50 text-sky-700', text: 'text-sky-700' },
+          { label: 'Total Pengurus', value: stats.totalSubDepartments, icon: <Users2 size={22} />, tone: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50 text-sky-700', text: 'text-sky-700' },
           { label: 'Total Event', value: stats.totalEvents, icon: <CalendarDays size={22} />, tone: 'from-violet-500 to-fuchsia-500', bg: 'bg-violet-50 text-violet-700', text: 'text-violet-700' },
           { label: 'Total Lomba', value: stats.totalLomba, icon: <Trophy size={22} />, tone: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700' },
+          { label: 'Total Merchandise', value: stats.totalMerchandise, icon: <ShoppingCart size={22} />, tone: 'from-rose-500 to-pink-500', bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700' },
+          { label: 'Merch Tersedia', value: stats.availableMerchandise, icon: <Package size={22} />, tone: 'from-lime-500 to-green-500', bg: 'bg-lime-50 text-lime-700', text: 'text-lime-700' },
         ].map((item) => (
           <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
             <div className="flex items-start justify-between">

```

Dengan semua perubahan ini, fitur "Merchandise IMAMA" telah terintegrasi penuh ke dalam website Anda, baik dari sisi admin maupun publik.

<!--
[PROMPT_SUGGESTION]Bagaimana cara menambahkan fitur rating dan ulasan pada halaman merchandise?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Buatkan halaman detail untuk setiap produk merchandise.[/PROMPT_SUGGESTION]
-->
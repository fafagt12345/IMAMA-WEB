import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Gallery from './Gallery';
import Programs from './Programs';
import About from './About';
import Structure from './Structure';
import Contact from './Contact';
import Event from './Event';
import EventDetail from './EventDetail';
import AdminDashboard from './AdminDashboard';
import AdminSidebar from './AdminSidebar';
import ManageStructure from './ManageStructure';
import ManageEvents from './ManageEvents';
import ManageHero from './ManageHero';
import ManageDepartments from './ManageDepartments';
import ManageContact from './ManageContact';
import ManageNews from './ManageNews';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/events" element={<Event />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/program-kerja" element={<Programs />} />
          <Route path="/tentang" element={<About />} /> {/* Tambahkan route untuk halaman Tentang */}
          <Route path="/struktur" element={<Structure />} />
          <Route path="/kontak" element={<Contact />} />
          
          {/* Halaman Admin yang Dilindungi */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminSidebar><AdminDashboard /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/structure" element={<ProtectedRoute><AdminSidebar><ManageStructure /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><AdminSidebar><ManageEvents /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/hero" element={<ProtectedRoute><AdminSidebar><ManageHero /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute><AdminSidebar><ManageDepartments /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/contact" element={<ProtectedRoute><AdminSidebar><ManageContact /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><AdminSidebar><ManageNews /></AdminSidebar></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
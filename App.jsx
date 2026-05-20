import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import ManageStructure from './ManageStructure';
import ManageDepartments from './ManageDepartments';
import Structure from './Structure';
import Navbar from './Navbar';
import Gallery from './Gallery';
import ManageGallery from './ManageGallery';
import Programs from './Programs';
import ManagePrograms from './ManagePrograms';
import ManageAbout from './ManageAbout';
import ManageHero from './ManageHero'; // Pastikan nama file di folder juga ManageHero.jsx
import ManageHistory from './ManageHistory'; // Tambahkan baris ini
import ManagePhilosophy from './ManagePhilosophy'; // Tambahkan baris ini
import Contact from './Contact';
import About from './About'; // Pastikan About diimport
import ManageContact from './ManageContact';
import Footer from './Footer';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/program-kerja" element={<Programs />} />
          <Route path="/tentang" element={<About />} /> {/* Tambahkan route untuk halaman Tentang */}
          <Route path="/struktur" element={<Structure />} />
          <Route path="/kontak" element={<Contact />} />
          
          {/* Halaman Admin yang Dilindungi */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/structure" element={
            <ProtectedRoute>
              <ManageStructure />
            </ProtectedRoute>
          } />
          <Route path="/admin/departments" element={
            <ProtectedRoute>
              <ManageDepartments />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <ManageGallery />
            </ProtectedRoute>
          } />
          <Route path="/admin/philosophy" element={
            <ProtectedRoute>
              <ManagePhilosophy />
            </ProtectedRoute>
          } />
          <Route path="/admin/hero" element={
            <ProtectedRoute>
              <ManageHero />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <ManageAbout />
            </ProtectedRoute>
          } />
          <Route path="/admin/history" element={
            <ProtectedRoute>
              <ManageHistory />
            </ProtectedRoute>
          } />
          <Route path="/admin/programs" element={
            <ProtectedRoute>
              <ManagePrograms />
            </ProtectedRoute>
          } />
          <Route path="/admin/contact" element={
            <ProtectedRoute>
              <ManageContact />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
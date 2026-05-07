import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import ManageStructure from './ManageStructure';
import ManageNews from './ManageNews';
import Structure from './Structure';
import Navbar from './Navbar';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import About from './About';
import Gallery from './Gallery';
import ManageGallery from './ManageGallery';
import Programs from './Programs';
import ManagePrograms from './ManagePrograms';
import ManageAbout from './ManageAbout';
import Contact from './Contact';
import ManageContact from './ManageContact';
import Footer from './Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tentang" element={<About />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/program-kerja" element={<Programs />} />
          <Route path="/struktur" element={<Structure />} />
          <Route path="/berita" element={<NewsList />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/kontak" element={<Contact />} />
          
          {/* Halaman Admin yang Dilindungi */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <ManageNews />
            </ProtectedRoute>
          } />
          <Route path="/admin/structure" element={
            <ProtectedRoute>
              <ManageStructure />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <ManageGallery />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <ManageAbout />
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
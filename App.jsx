import ManageContact from './ManageContact';
import Footer from './Footer';
import ManageEvents from './ManageEvents';
import ManageHero from './ManageHero';
import AdminDashboard from './AdminDashboard';
import AdminSidebar from './AdminSidebar';
import ManageStructure from './ManageStructure';
import ManageDepartments from './ManageDepartments';

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
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminSidebar><AdminDashboard /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/structure" element={<ProtectedRoute><AdminSidebar><ManageStructure /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><AdminSidebar><ManageEvents /></ProtectedRoute>} />
          <Route path="/admin/hero" element={<ProtectedRoute><AdminSidebar><ManageHero /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute><AdminSidebar><ManageDepartments /></AdminSidebar></ProtectedRoute>} />
          <Route path="/admin/contact" element={<ProtectedRoute><AdminSidebar><ManageContact /></AdminSidebar></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAuth from "./components/RequireAuth";

// Public
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import WorksPage from "./pages/WorksPage";
import WorkDetailsPage from "./pages/WorkDetailsPage";


function App() {
  return (
    <Routes>
      {/* ===== Public site ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/:categorySlug" element={<WorksPage />} />
      <Route path="/work/:workId" element={<WorkDetailsPage />} />

      {/* ===== Admin ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"   element={<RequireAuth><AdminDashboard /></RequireAuth>} />
    </Routes>
  );
}

export default App;

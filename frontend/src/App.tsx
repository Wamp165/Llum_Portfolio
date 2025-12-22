import { Routes, Route } from "react-router-dom";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Public
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      {/* ===== Public site ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* ===== Admin ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"   element={<RequireAuth><AdminDashboard /></RequireAuth>} />
    </Routes>
  );
}

export default App;

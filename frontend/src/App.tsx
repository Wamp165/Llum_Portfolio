import { Routes, Route } from "react-router-dom";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Public
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      {/* ===== Public site ===== */}
      <Route path="/" element={<HomePage />} />

      {/* ===== Admin ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

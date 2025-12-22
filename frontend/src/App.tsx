import { Routes, Route } from "react-router-dom";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RequireAuth from "./components/RequireAuth";

// Public


function App() {
  return (
    <Routes>
      {/* ===== Public site ===== */}

      {/* ===== Admin ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin"   element={<RequireAuth><AdminDashboard /></RequireAuth>} />
    </Routes>
  );
}

export default App;

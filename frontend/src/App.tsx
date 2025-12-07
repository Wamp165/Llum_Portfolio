//frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME PAGE for each user */}
        <Route path="/:slug" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

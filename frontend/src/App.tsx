//frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import StoriesPage from "./pages/StoriesPage";
import CommercialsPage from "./pages/CommercialsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:slug" element={<HomePage />} />
        <Route path="/:slug/projects" element={<ProjectsPage />} />
        <Route path="/:slug/stories" element={<StoriesPage />} />
        <Route path="/:slug/commercial" element={<CommercialsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

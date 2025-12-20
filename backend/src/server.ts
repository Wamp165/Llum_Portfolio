import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import worksRoutes from "./routes/works";
import workSectionsRoutes from "./routes/workSections";
import workSectionImagesRoutes from "./routes/workSectionImages";

import userRoutes from "./routes/user";
import { requireAuth } from "./middleware/requireAuth";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Auth
app.use("/auth", authRoutes);

// Admin / protected resources
app.use("/user", userRoutes);
app.use("/categories", categoriesRoutes);
app.use("/works", worksRoutes);
app.use("/works", workSectionsRoutes);
app.use("/sections", workSectionImagesRoutes);

// Simple auth check
app.get("/admin/me", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user!.id,
  });
});

app.listen(3001, () => {
  console.log("Llum backend server running on http://localhost:3001");
});

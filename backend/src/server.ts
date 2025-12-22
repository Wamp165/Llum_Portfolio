import express from "express";
import cors from "cors";
import * as z from "zod";

import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import worksRoutes from "./routes/works";
import workSectionsRoutes from "./routes/workSections";
import workSectionImagesRoutes from "./routes/workSectionImages";
import publicRoutes from "./routes/public";

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
app.use("/", categoriesRoutes);
app.use("/", worksRoutes);
app.use("/works", workSectionsRoutes);
app.use("/sections", workSectionImagesRoutes);

// Public resources
app.use("/public", publicRoutes);

// Simple auth check
app.get("/admin/me", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user!.id,
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: "Invalid request", errors: err.issues });
  }
  res.status(500).json({ message: "Internal server error" });
})

app.listen(3001, () => {
  console.log("Llum backend server running on http://localhost:3001");
});

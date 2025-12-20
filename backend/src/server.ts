import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import { requireAuth } from "./middleware/requireAuth";
import userRoutes  from "./routes/user";

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Register route handlers
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/user", userRoutes );
app.get("/admin/me", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user?.id,
  });
});

// Start HTTP server
app.listen(3001, () => {
  console.log("Llum backend server running on http://localhost:3001");
});

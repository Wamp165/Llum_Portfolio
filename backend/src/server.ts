import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);

// Start HTTP server
app.listen(3001, () => {
  console.log("Llum backend server running on http://localhost:3001");
});

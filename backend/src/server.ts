// src/server.ts
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import worksRoutes from "./routes/works.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/works", worksRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

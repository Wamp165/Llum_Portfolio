import express from "express";
import routes from "./routes";

const app = express();

// Allows JSON bodies in requests
app.use(express.json());

// Register all routes
app.use(routes);

export default app;

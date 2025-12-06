import { Router } from "express";
import userRoutes from "./user.routes";
import worksRoutes from "./works.routes";

const router = Router();

// All user related routes
router.use("/", userRoutes);

// All work related routes
router.use("/", worksRoutes);

export default router;
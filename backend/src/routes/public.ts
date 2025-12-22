import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

/**
 * GET /public/user
 * Returns the public profile for the single portfolio owner.
 * Assumes only one user exists (MVP).
 */
router.get("/user", async (_req, res) => {
  const user = await prisma.user.findFirst({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      bio: true,
      homeBanner: true,
      profilePicture: true,
      contactEmail: true,
      instagram: true,
      substack: true,
      location: true,
    },
  });

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;

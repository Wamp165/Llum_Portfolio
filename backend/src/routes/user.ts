import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * GET /user/me
 * Returns the authenticated user's editable profile data
 */
router.get("/me", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
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

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/**
 * PATCH /user/me
 * Updates the authenticated user's profile
 */
router.patch("/me", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  const {
    name,
    bio,
    homeBanner,
    profilePicture,
    contactEmail,
    instagram,
    substack,
    location,
  } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      bio,
      homeBanner,
      profilePicture,
      contactEmail,
      instagram,
      substack,
      location,
    },
    select: {
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

  res.json(updatedUser);
});

export default router;

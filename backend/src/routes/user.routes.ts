import { Router } from "express";
import { prisma } from "../prisma";
import { getErrorMessage } from "../utils/errors";

const router = Router();

/* ============================================================
   GET /user/:slug
   Get public user profile for homepage
   ============================================================ */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        homeBanner: true, // homepage banner image
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json(user);
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error fetching user:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   PUT /user/:slug
   Update basic user info (name, bio)
   ============================================================ */
router.put("/:slug", async (req, res) => {
  const { slug } = req.params;
  const { name, bio } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { slug } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name, bio },
    });

    return res.json({ success: true, user: updated });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error updating user:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   PUT /user/:slug/home-banner
   Update only the homepage banner image
   ============================================================ */
router.put("/:slug/home-banner", async (req, res) => {
  const { slug } = req.params;
  const { homeBanner } = req.body; // URL or image path

  if (!homeBanner) {
    return res
      .status(400)
      .json({ success: false, error: "homeBanner is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { slug } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { homeBanner },
    });

    return res.json({ success: true, user: updated });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error updating homeBanner:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   PUT /user/:slug/slug
   Change user slug (optional)
   Useful for multi-user support later
   ============================================================ */
router.put("/:slug/slug", async (req, res) => {
  const oldSlug = req.params.slug;
  const { newSlug } = req.body;

  if (!newSlug) {
    return res
      .status(400)
      .json({ success: false, error: "newSlug is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { slug: oldSlug } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { slug: newSlug },
    });

    return res.json({ success: true, user: updated });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error updating user slug:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

export default router;

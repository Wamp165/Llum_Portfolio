import { Router } from "express";
import { prisma } from "../prisma";
import { WorkSectionType } from "@prisma/client";
import { getErrorMessage } from "../utils/errors";

const router = Router();

// Type used for updating sections
interface SectionInput {
  type: WorkSectionType;
  text?: string;
  image?: string;
  order: number;
}

/* ============================================================
   GET /works/:slug
   Get ALL works of a user (NO SECTIONS)
   ============================================================ */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const works = await prisma.work.findMany({
      where: { user: { slug } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        banner: true,
        category: true,
        createdAt: true,
      },
    });

    return res.json(works);
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error fetching works:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   POST /works/:slug
   Create a new work for a user
   ============================================================ */
router.post("/:slug", async (req, res) => {
  const { slug } = req.params;
  const { title, banner, category } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { slug } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const newWork = await prisma.work.create({
      data: { title, banner, category, userId: user.id },
    });

    return res.json(newWork);
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error creating work:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   PUT /works/:slug/:workId
   Update work info
   ============================================================ */
router.put("/:slug/:workId", async (req, res) => {
  const { slug, workId } = req.params;
  const { title, banner, category } = req.body;

  try {
    const work = await prisma.work.findFirst({
      where: {
        id: Number(workId),
        user: { slug },
      },
    });

    if (!work) {
      return res.status(404).json({ success: false, error: "Work not found" });
    }

    const updated = await prisma.work.update({
      where: { id: work.id },
      data: { title, banner, category },
    });

    return res.json(updated);
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error updating work:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   DELETE /works/:slug/:workId
   Delete work and its sections
   ============================================================ */
router.delete("/:slug/:workId", async (req, res) => {
  const { slug, workId } = req.params;

  try {
    const work = await prisma.work.findFirst({
      where: { id: Number(workId), user: { slug } },
    });

    if (!work) {
      return res.status(404).json({ success: false, error: "Work not found" });
    }

    // Delete sections first
    await prisma.workSection.deleteMany({
      where: { workId: work.id },
    });

    await prisma.work.delete({ where: { id: work.id } });

    return res.json({ success: true, message: "Work deleted" });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error deleting work:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   GET /works/:slug/:workId/sections
   Fetch all sections for one work
   ============================================================ */
router.get("/:slug/:workId/sections", async (req, res) => {
  const { slug, workId } = req.params;

  try {
    const work = await prisma.work.findFirst({
      where: { id: Number(workId), user: { slug } },
    });

    if (!work) {
      return res.status(404).json({ success: false, error: "Work not found" });
    }

    const sections = await prisma.workSection.findMany({
      where: { workId: work.id },
      orderBy: { order: "asc" },
    });

    return res.json(sections);
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error fetching sections:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   PUT /works/:slug/:workId/sections
   Overwrite ALL sections of a work
   ============================================================ */
router.put("/:slug/:workId/sections", async (req, res) => {
  const { slug, workId } = req.params;
  const { sections } = req.body;

  try {
    const work = await prisma.work.findFirst({
      where: { id: Number(workId), user: { slug } },
    });

    if (!work) {
      return res.status(404).json({ success: false, error: "Work not found" });
    }

    // Validate incoming sections
    const validSections: SectionInput[] = sections.map((s: SectionInput) => ({
      type: s.type,
      text: s.text,
      image: s.image,
      order: s.order,
    }));

    // Delete old
    await prisma.workSection.deleteMany({
      where: { workId: work.id },
    });

    // Insert new
    await prisma.workSection.createMany({
      data: validSections.map((s) => ({
        workId: work.id,
        type: s.type,
        text: s.text,
        image: s.image,
        order: s.order,
      })),
    });

    return res.json({
      success: true,
      message: "Sections updated successfully",
    });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error updating sections:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

/* ============================================================
   DELETE /works/:slug/:workId/sections
   Delete all sections of a work
   ============================================================ */
router.delete("/:slug/:workId/sections", async (req, res) => {
  const { slug, workId } = req.params;

  try {
    const work = await prisma.work.findFirst({
      where: { id: Number(workId), user: { slug } },
    });

    if (!work) {
      return res.status(404).json({ success: false, error: "Work not found" });
    }

    await prisma.workSection.deleteMany({
      where: { workId: work.id },
    });

    return res.json({ success: true, message: "Sections deleted" });
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error deleting sections:", message);
    return res.status(500).json({ success: false, error: message });
  }
});

export default router;

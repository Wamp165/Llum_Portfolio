import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * GET /works/:workId/sections
 */
router.get("/:workId/sections", requireAuth, async (req, res) => {
  const workId = Number(req.params.workId);

  const sections = await prisma.workSection.findMany({
    where: { workId },
    orderBy: { order: "asc" },
    include: { images: true },
  });

  res.json(sections);
});

/**
 * POST /works/:workId/sections
 */
router.post("/:workId/sections", requireAuth, async (req, res) => {
  const workId = Number(req.params.workId);
  const { type, text, order } = req.body;

  const section = await prisma.workSection.create({
    data: {
      workId,
      type,
      text,
      order,
    },
  });

  res.status(201).json(section);
});

/**
 * PATCH /sections/:id
 */
router.patch("/sections/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  const section = await prisma.workSection.update({
    where: { id },
    data: req.body,
  });

  res.json(section);
});

/**
 * DELETE /sections/:id
 */
router.delete("/sections/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.workSection.delete({ where: { id } });
  res.status(204).send();
});

export default router;

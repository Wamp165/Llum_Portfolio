import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * GET /works
 * List all works (admin)
 */
router.get("/", requireAuth, async (_req, res) => {
  const works = await prisma.work.findMany({
    orderBy: { order: "asc" },
    include: {
      category: true,
    },
  });

  res.json(works);
});

/**
 * POST /works
 */
router.post("/", requireAuth, async (req, res) => {
  const { title, description, categoryId, order, banner } = req.body;

  if (!title || !categoryId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const work = await prisma.work.create({
    data: {
      title,
      description,
      banner,
      order: order ?? 0,
      categoryId,
      userId: req.user!.id,
    },
  });

  res.status(201).json(work);
});

/**
 * PATCH /works/:id
 */
router.patch("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  const work = await prisma.work.update({
    where: { id },
    data: req.body,
  });

  res.json(work);
});

/**
 * DELETE /works/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.work.delete({ where: { id } });
  res.status(204).send();
});

export default router;

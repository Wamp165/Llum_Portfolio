import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

/**
 * POST /sections/:sectionId/images
 */
router.post("/:sectionId/images", requireAuth, async (req, res) => {
  const sectionId = Number(req.params.sectionId);
  const { imageUrl, order } = req.body;

  const image = await prisma.workSectionImage.create({
    data: {
      workSectionId: sectionId,
      imageUrl,
      order,
    },
  });

  res.status(201).json(image);
});

/**
 * PATCH /images/:id
 */
router.patch("/images/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  const image = await prisma.workSectionImage.update({
    where: { id },
    data: req.body,
  });

  res.json(image);
});

/**
 * DELETE /images/:id
 */
router.delete("/images/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.workSectionImage.delete({ where: { id } });
  res.status(204).send();
});

export default router;

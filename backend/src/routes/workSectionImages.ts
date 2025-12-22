import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";
import { Prisma } from "@prisma/client";
import {
  sectionIdParamSchema,
  imageIdParamSchema,
  createWorkSectionImageSchema,
  updateWorkSectionImageSchema,
} from "../schemas/workSectionImage.schema";

const router = Router();

/**
 * GET /sections/:sectionId/images
 * Public: list images for a section
 */
router.get("/:sectionId/images", async (req, res) => {
  const { sectionId } = sectionIdParamSchema.parse(req.params);

  const section = await prisma.workSection.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  const images = await prisma.workSectionImage.findMany({
    where: { workSectionId: sectionId },
    orderBy: { order: "asc" },
  });

  res.json(images);
});

/**
 * POST /sections/:sectionId/images
 */
router.post("/:sectionId/images", requireAuth, async (req, res) => {
  const { sectionId } = sectionIdParamSchema.parse(req.params);
  const { imageUrl, order } = createWorkSectionImageSchema.parse(req.body);

  const section = await prisma.workSection.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  const image = await prisma.workSectionImage.create({
    data: {
      workSectionId: sectionId,
      imageUrl,
      order: order ?? 0,
    },
  });

  res.status(201).json(image);
});

/**
 * PATCH /sections/images/:id
 */
router.patch("/images/:id", requireAuth, async (req, res) => {
  const { id } = imageIdParamSchema.parse(req.params);
  const { imageUrl, order } = updateWorkSectionImageSchema.parse(req.body);

  const existingImage = await prisma.workSectionImage.findUnique({
    where: { id },
  });

  if (!existingImage) {
    return res.status(404).json({ message: "Image not found" });
  }

  const data: Prisma.WorkSectionImageUpdateInput = {};

  if (imageUrl !== undefined) data.imageUrl = imageUrl;
  if (order !== undefined) data.order = order;

  const image = await prisma.workSectionImage.update({
    where: { id },
    data,
  });

  res.json(image);
});

/**
 * DELETE /sections/images/:id
 */
router.delete("/images/:id", requireAuth, async (req, res) => {
  const { id } = imageIdParamSchema.parse(req.params);

  const image = await prisma.workSectionImage.findUnique({
    where: { id },
  });

  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  await prisma.workSectionImage.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;

import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";
import { Prisma } from "@prisma/client";
import {
  workIdParamSchema,
  sectionIdParamSchema,
  createWorkSectionSchema,
  updateWorkSectionSchema,
} from "../schemas/workSection.schema";

const router = Router();

/**
 * GET /works/:workId/sections
 */
router.get("/:workId/sections", async (req, res) => {
  const { workId } = workIdParamSchema.parse(req.params);

  const work = await prisma.work.findUnique({
    where: { id: workId },
  });

  if (!work) {
    return res.status(404).json({ message: "Work not found" });
  }

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
  const { workId } = workIdParamSchema.parse(req.params);
  const { type, text, order } = createWorkSectionSchema.parse(req.body);

  const work = await prisma.work.findUnique({
    where: { id: workId },
  });

  if (!work) {
    return res.status(404).json({ message: "Work not found" });
  }

  const section = await prisma.workSection.create({
    data: {
      workId,
      type,
      text,
      order: order ?? 0,
    },
  });

  res.status(201).json(section);
});

/**
 * PATCH /sections/:id
 */
router.patch("/sections/:id", requireAuth, async (req, res) => {
  const { id } = sectionIdParamSchema.parse(req.params);
  const { type, text, order } = updateWorkSectionSchema.parse(req.body);

  const existingSection = await prisma.workSection.findUnique({
    where: { id },
  });

  if (!existingSection) {
    return res.status(404).json({ message: "Section not found" });
  }

  const data: Prisma.WorkSectionUpdateInput = {};

  if (type !== undefined) data.type = type;
  if (text !== undefined) data.text = text;
  if (order !== undefined) data.order = order;

  const section = await prisma.workSection.update({
    where: { id },
    data,
  });

  res.json(section);
});

/**
 * DELETE /sections/:id
 */
router.delete("/sections/:id", requireAuth, async (req, res) => {
  const { id } = sectionIdParamSchema.parse(req.params);

  const section = await prisma.workSection.findUnique({
    where: { id },
  });

  if (!section) {
    return res.status(404).json({ message: "Section not found" });
  }

  await prisma.workSection.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;

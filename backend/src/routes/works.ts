import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";
import { Prisma } from "@prisma/client";
import {
  categoryIdParamSchema,
  workIdParamSchema,
  createWorkSchema,
  updateWorkSchema,
} from "../schemas/work.schema";

const router = Router();

/**
 * GET /categories/:categoryId/works
 * List all works for a category
 */
router.get("/categories/:categoryId/works", async (req, res) => {
  const { categoryId } = categoryIdParamSchema.parse(req.params);

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const works = await prisma.work.findMany({
    where: { categoryId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      introduction: true,
      date: true,
      banner: true,
      order: true,
      createdAt: true,
      categoryId: true,
    },
  });

  res.json(works);
});

/**
 * POST /works
 * Create a new work
 */
router.post("/works", requireAuth, async (req, res) => {
  const {
    title,
    description,
    banner,
    date,
    introduction,
    categoryId,
    order,
  } = createWorkSchema.parse(req.body);

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (category.userId !== req.user!.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const work = await prisma.work.create({
    data: {
      title,
      description,
      banner,
      date,
      introduction,
      order: order ?? 0,
      categoryId,
    },
  });

  res.status(201).json(work);
});

/**
 * PATCH /works/:id
 * Update a work
 */
router.patch("/works/:id", requireAuth, async (req, res) => {
  const { id } = workIdParamSchema.parse(req.params);

  const {
    title,
    description,
    banner,
    date,
    introduction,
    order,
  } = updateWorkSchema.parse(req.body);

  const existingWork = await prisma.work.findUnique({
    where: { id },
  });

  if (!existingWork) {
    return res.status(404).json({ message: "Work not found" });
  }

  const data: Prisma.WorkUpdateInput = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (banner !== undefined) data.banner = banner;
  if (date !== undefined) data.date = date;
  if (introduction !== undefined) data.introduction = introduction;
  if (order !== undefined) data.order = order;

  const work = await prisma.work.update({
    where: { id },
    data,
  });

  res.json(work);
});

/**
 * DELETE /works/:id
 * Delete a work
 */
router.delete("/works/:id", requireAuth, async (req, res) => {
  const { id } = workIdParamSchema.parse(req.params);

  const work = await prisma.work.findUnique({
    where: { id },
  });

  if (!work) {
    return res.status(404).json({ message: "Work not found" });
  }

  await prisma.work.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;

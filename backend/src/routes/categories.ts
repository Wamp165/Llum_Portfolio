import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";
import { slugify } from "../utils/slugify";

const router = Router();

/**
 * GET /categories
 * Returns all categories (admin view)
 */
router.get("/", requireAuth, async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  res.json(categories);
});

/**
 * POST /categories
 * Creates a new category (slug is generated automatically)
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, description, order } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const slug = slugify(name);

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      order: order ?? 0,
    },
  });

  res.status(201).json(category);
});

/**
 * PATCH /categories/:id
 * Updates a category (slug is regenerated if name changes)
 */
router.patch("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, order } = req.body;

  const data: any = {
    description,
    order,
  };

  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }

  const category = await prisma.category.update({
    where: { id },
    data,
  });

  res.json(category);
});

/**
 * DELETE /categories/:id
 * Deletes a category
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  await prisma.category.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;

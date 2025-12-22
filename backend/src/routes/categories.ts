import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/requireAuth";
import { slugify } from "../utils/slugify";
import { Prisma } from "@prisma/client";
import {userIdParamSchema, categoryIdParamSchema, updateCategorySchema} from "../schemas/category.schema";

const router = Router();

/**
 * GET /users/:userId/categories
 */
router.get("/users/:userId/categories",async (req, res) => {
  const { userId } = userIdParamSchema.parse(req.params);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });

  res.json(categories);
}
);

/**
 * PATCH /categories/:id
 */
router.patch("/categories/:id", requireAuth, async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const { name, description, order } =
      updateCategorySchema.parse(req.body);

    const data: Prisma.CategoryUpdateInput = {
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
  }
);

export default router;

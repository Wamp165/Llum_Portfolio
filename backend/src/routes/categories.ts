import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// GET /categories
router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  res.json(categories);
});

// GET /categories/:slug/works
router.get("/:slug/works", async (req, res) => {
  const { slug } = req.params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      works: {
        orderBy: { order: "asc" },
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: {
              images: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category.works);
});

export default router;

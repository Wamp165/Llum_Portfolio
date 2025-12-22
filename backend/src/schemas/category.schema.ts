import { z } from "zod";

export const userIdParamSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
});

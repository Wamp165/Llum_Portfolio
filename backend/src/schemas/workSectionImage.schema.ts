import { z } from "zod";

export const sectionIdParamSchema = z.object({
  sectionId: z.coerce.number().int().positive(),
});

export const imageIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createWorkSectionImageSchema = z.object({
  imageUrl: z.string().min(1), // Prisma: String (no necesariamente url)
  order: z.number().int().min(0).optional(), // Prisma: Int (sin default) -> lo ponemos default en router
});

export const updateWorkSectionImageSchema = z.object({
  imageUrl: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
});

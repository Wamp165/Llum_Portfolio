import { z } from "zod";

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export const workIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * CREATE → description ES OBLIGATORIO
 */
export const createWorkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000), // ✅ REQUIRED
  banner: z.string().url().optional(),
  categoryId: z.coerce.number().int().positive(),
  order: z.number().int().min(0).optional(),
});

/**
 * UPDATE → description opcional, pero si viene es string
 */
export const updateWorkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(), // ✅ OK
  banner: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
});

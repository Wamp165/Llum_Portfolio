import { z } from "zod";

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export const workIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createWorkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  banner: z.string().url().nullable().optional(),
  date: z.string().max(200).nullable().optional(),
  introduction: z.string().max(5000).nullable().optional(),
  categoryId: z.coerce.number().int().positive(),
  order: z.number().int().min(0).optional(),
});

export const updateWorkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  banner: z.string().url().nullable().optional(),
  date: z.string().max(200).nullable().optional(),
  introduction: z.string().max(5000).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

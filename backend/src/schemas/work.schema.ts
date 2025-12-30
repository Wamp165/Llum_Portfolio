import { z } from "zod";

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export const workIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * CREATE
 */
export const createWorkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
  date: z.string().max(200).optional(),
  introduction: z.string().max(5000).optional(),
  categoryId: z.coerce.number().int().positive(),
  order: z.number().int().min(0).optional(),
});


/**
 * UPDATE
 */
export const updateWorkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(1000).optional(),
  banner: z.string().url().optional().or(z.literal("")),
  date: z.string().max(200).optional(),
  introduction: z.string().max(5000).optional(),
  order: z.number().int().min(0).optional(),
});

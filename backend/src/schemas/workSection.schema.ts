import { z } from "zod";
import { WorkSectionType } from "@prisma/client";

export const workIdParamSchema = z.object({
  workId: z.coerce.number().int().positive(),
});

export const sectionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createWorkSectionSchema = z.object({
  type: z.nativeEnum(WorkSectionType),
  text: z.string().max(5000).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

export const updateWorkSectionSchema = z.object({
  type: z.nativeEnum(WorkSectionType).optional(),
  text: z.string().max(5000).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

import z from "zod";

export const poemContentZodSchema = z
  .string()
  .min(10, "too short, needed min 10 chars")
  .max(20000, "Too long, Max 20000 chars");

export const poemTitleZodSchema = z
  .string()
  .min(3, "too short, needed min 3 chars")
  .max(150, "Too long, Max 150 chars");

export const addPoemZodSchema = z.object({
  title: poemTitleZodSchema,
  content: poemContentZodSchema,
});

export const editPoemZodSchema = z.object({
  title: poemTitleZodSchema.optional(),
  content: poemContentZodSchema.optional(),
});

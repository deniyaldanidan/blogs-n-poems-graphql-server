import z from "zod";

export const blogContentZodSchema = z
  .string()
  .min(10, "too short, needed min 10 chars")
  .max(45000, "Too long, Max 45000 chars");

export const blogTitleZodSchema = z
  .string()
  .min(3, "too short, needed min 3 chars")
  .max(150, "Too long, Max 150 chars");

export const blogDescriptionZodSchema = z
  .string()
  .min(3, "too short, needed min 3 chars")
  .max(300, "Too long, Max 300 chars");

export const addBlogZodSchema = z.object({
  title: blogTitleZodSchema,
  description: blogDescriptionZodSchema,
  content: blogContentZodSchema,
});

export const editBlogZodSchema = z.object({
  title: blogTitleZodSchema.optional(),
  description: blogDescriptionZodSchema.optional(),
  content: blogContentZodSchema.optional(),
});

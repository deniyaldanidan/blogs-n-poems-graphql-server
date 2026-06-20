import z from "zod";

export const blogContentZodSchema = z
  .string()
  .min(10, "too short, needed min 10 chars")
  .max(45000, "Too long, Max 45000 chars");

export const addBlogZodSchema = z.object({
  title: z
    .string()
    .min(3, "too short, needed min 3 chars")
    .max(150, "Too long, Max 150 chars"),
  description: z
    .string()
    .min(3, "too short, needed min 3 chars")
    .max(300, "Too long, Max 300 chars"),
  content: blogContentZodSchema,
});

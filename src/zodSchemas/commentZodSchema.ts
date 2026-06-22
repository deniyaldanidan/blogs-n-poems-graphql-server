import z from "zod";

export const addCommentZodSchema = z.object({
  id: z.int(),
  comment: z
    .string()
    .trim()
    .min(2, "Min 2 chars are needed")
    .max(990, "max 990 chars are allowed"),
});

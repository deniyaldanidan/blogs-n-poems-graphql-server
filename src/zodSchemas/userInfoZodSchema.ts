import z from "zod";
import { nameOfUserZodSchema } from "./signUpZodSchema.js";

const userInfoZodSchema = z.object({
  name: nameOfUserZodSchema.optional(),
  about: z
    .string()
    .trim()
    .min(5, "MIN 5 chars are needed")
    .max(1500, "MAX 1500 chars are allowed")
    .optional(),
});

export default userInfoZodSchema;

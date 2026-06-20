import z from "zod";

const correctionZodSchema = z
  .string()
  .trim()
  .min(3, "Minimum 3 chars needed")
  .max(990, "Max 990 chars are allowed");

export default correctionZodSchema;

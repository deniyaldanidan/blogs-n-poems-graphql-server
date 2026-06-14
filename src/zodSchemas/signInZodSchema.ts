import z from "zod";

const signInZodSchema = z.object(
  {
    unameOrEmail: z.string("unameOrEmail should be a string"),
    pwd: z.string("pwd should be a string"),
  },
  { error: "Sign In Object is missing" },
);

export default signInZodSchema;

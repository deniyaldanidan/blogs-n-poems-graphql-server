import z from "zod";

export const nameOfUserZodSchema = z
  .string("name should be a string")
  .trim()
  .min(2, "name is too short")
  .max(60, "name is too long")
  .regex(
    /^[a-zA-Z 0-9]{2,60}$/,
    "Only alphanumeric and single space characters are allowed",
  );

const signUpZodSchema = z.object(
  {
    name: nameOfUserZodSchema,
    username: z
      .string("username should be a string")
      .trim()
      .min(2, "username too short")
      .max(60, "username too long")
      .regex(/^[a-zA-Z0-9_.-]{2,60}$/, "Only alphanumeric and _.- are allowed"),
    email: z.email("email should be a string").max(254, "Email too long"),
    password: z
      .string("password should be a string")
      .min(8, "password too short")
      .max(75, "password too long"),
  },
  { error: "Sign-Up object is missing" },
);

export default signUpZodSchema;

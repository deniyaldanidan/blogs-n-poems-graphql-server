import z from "zod";
import { userRolesEnum } from "../helpers/constants.js";

const authUserInfoZodSchema = z.object({
  userId: z.string(),
  username: z.string(),
  role: z.enum(userRolesEnum),
});

export default authUserInfoZodSchema;

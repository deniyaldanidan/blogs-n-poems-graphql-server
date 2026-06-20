import z from "zod";
import { userRolesEnum } from "../helpers/constants.js";

export const bearerParser = z.string().startsWith("Bearer ");
export const jwtParser = z.jwt();
export const accessPayloadParser = z.object({
  userId: z.string(),
  username: z.string(),
  role: z.enum(userRolesEnum).array(),
});

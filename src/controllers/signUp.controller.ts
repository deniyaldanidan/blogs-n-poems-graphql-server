import { Request, Response } from "express";
import signUpZodSchema from "../zodSchemas/signUpZodSchema.js";
import db from "../db/db.js";
import { sessions, users } from "../db/schema/schema.js";
import { eq, or } from "drizzle-orm";
import { AlreadyExistError } from "../helpers/custom_errors.js";
import bcrypt from "bcrypt";
import { signAccess, signRefresh } from "../helpers/auth.js";
import {
  APP_JSON_RESPONSES,
  HTTP_STATUS,
  REFRESH_COOKIE_NAME,
  userRolesObj,
} from "../helpers/constants.js";
import { signInRefreshCookieOptions } from "../helpers/helpers.js";

export default async function signUpController(req: Request, res: Response) {
  // validate the req.body
  const data = signUpZodSchema.parse(req.body);

  // Check if user-already exists, If True => Tell them to logIn
  const foundUser = await db
    .select()
    .from(users)
    .where(or(eq(users.username, data.username), eq(users.email, data.email)));
  if (foundUser.length) {
    throw new AlreadyExistError("User already exist, Try Sign-In");
  }

  // If False, Create new User
  const hashedPWD = await bcrypt.hash(data.password, 10);
  const createdUser = await db
    .insert(users)
    .values({
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPWD,
    })
    .$returningId();

  const createdUserId = createdUser[0];
  const createdUserRole = userRolesObj.guest; // Newly created user will always be GUEST

  // Create the tokens
  const accessToken = signAccess({
    userId: createdUserId.id,
    username: data.username,
    role: createdUserRole,
  });

  const refreshData = signRefresh({ username: data.username });

  // Save Refresh-Token to DB
  await db.insert(sessions).values({
    refresh: refreshData.token,
    expires: refreshData.expires,
    userId: createdUserId.id,
  });

  // Send the Refresh-Token in a HTTP-Only-Cookie
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshData.token,
    signInRefreshCookieOptions(refreshData.maxAge),
  );

  // Send Access-Token in response
  return res
    .status(HTTP_STATUS.created)
    .json(APP_JSON_RESPONSES.signedIn(accessToken));
}

import { Request, Response } from "express";
import signInZodSchema from "../zodSchemas/signInZodSchema.js";
import db from "../db/db.js";
import { sessions, users } from "../db/schema/schema.js";
import { eq, or } from "drizzle-orm";
import {
  ResourceNotFoundError,
  UnAuthorizedError,
} from "../helpers/custom_errors.js";
import bcrypt from "bcrypt";
import { signAccess, signRefresh } from "../helpers/auth.js";
import {
  APP_JSON_RESPONSES,
  HTTP_STATUS,
  MAX_ALLOWED_SESSIONS,
  REFRESH_COOKIE_NAME,
} from "../helpers/constants.js";
import { signInRefreshCookieOptions } from "../helpers/helpers.js";

export default async function signInController(req: Request, res: Response) {
  // validate the req.body
  const data = signInZodSchema.parse(req.body);
  // check if user exists, If NOT throw NotFoundError saying User Does-not exist
  const result = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.username, data.unameOrEmail),
        eq(users.email, data.unameOrEmail),
      ),
    );

  const foundUser = result[0];

  if (!result.length || !foundUser.id || !foundUser.role) {
    throw new ResourceNotFoundError("User not Found, Try Sign-Up");
  }
  // IF True: Check if password matches, If Not Throw UnAuthorizedError saying Invalid Credentials err
  const match = await bcrypt.compare(data.pwd, foundUser.password);
  if (!match) {
    throw new UnAuthorizedError("Invalid Credentials");
  }
  // If True: Create new Tokens for the user
  const accessToken = signAccess({
    userId: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
  });

  const refreshData = signRefresh({ username: foundUser.username });

  // Check if DB has more than x amount of REFRESH, IF True Delete all previous-sessions
  const foundSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, foundUser.id));

  if (foundSessions.length > MAX_ALLOWED_SESSIONS) {
    await db.delete(sessions).where(eq(sessions.userId, foundUser.id));
  }

  // Save the Refresh in the DB
  await db.insert(sessions).values({
    userId: foundUser.id,
    refresh: refreshData.token,
    expires: refreshData.expires,
  });
  // Send The REFRESH in a cookie to the user
  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshData.token,
    signInRefreshCookieOptions(refreshData.maxAge),
  );
  // Send SIGNINSuccess Obj with Access TOken
  return res
    .status(HTTP_STATUS.success)
    .json(APP_JSON_RESPONSES.signedIn(accessToken));
}

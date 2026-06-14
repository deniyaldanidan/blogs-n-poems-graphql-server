import { Request, Response } from "express";
import z from "zod";
import {
  APP_JSON_RESPONSES,
  HTTP_STATUS,
  REFRESH_COOKIE_NAME,
} from "../helpers/constants.js";
import db from "../db/db.js";
import { sessions, users } from "../db/schema/schema.js";
import { eq } from "drizzle-orm";
import { signInRefreshCookieOptions } from "../helpers/helpers.js";
import { UnAuthorizedError } from "../helpers/custom_errors.js";
import { getRefreshSecret, signAccess } from "../helpers/auth.js";
import jwt from "jsonwebtoken";

export default async function refreshController(req: Request, res: Response) {
  // Check if the cookie has the refresh-token?
  const validRefreshCookieParseResult = z
    .jwt()
    .safeParse(req.cookies[REFRESH_COOKIE_NAME] ?? "");
  // If not found or not correct throw an UnAuthorizedError
  if (!validRefreshCookieParseResult.success) {
    throw new UnAuthorizedError("UnAuthorized action");
  }

  // * validate the token first
  jwt.verify(
    validRefreshCookieParseResult.data,
    getRefreshSecret(),
    (err, _) => {
      if (err) {
        throw new UnAuthorizedError("UnAuthorized action");
      }
    },
  );

  // If found, Check if it is in db => If not again throw an UnAuthorizedError
  const refreshDbQueryResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.refresh, validRefreshCookieParseResult.data));

  const foundCookie = refreshDbQueryResult[0];

  if (!foundCookie?.refresh) {
    res.cookie(REFRESH_COOKIE_NAME, "", signInRefreshCookieOptions(0));
    throw new UnAuthorizedError("UnAuthorized action");
  }
  // IF found in DB, then create new accessToken and send to user
  const userDbQueryResult = await db
    .select()
    .from(users)
    .where(eq(users.id, foundCookie.userId));
  const foundUser = userDbQueryResult[0];

  if (!foundUser?.id || !foundUser.role) {
    throw new Error("Unknown error happened");
  }
  const accessToken = signAccess({
    userId: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
  });
  return res
    .status(HTTP_STATUS.success)
    .json(APP_JSON_RESPONSES.signedIn(accessToken));
}

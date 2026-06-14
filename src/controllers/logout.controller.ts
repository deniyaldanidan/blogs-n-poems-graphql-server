import { Request, Response } from "express";
import z from "zod";
import { HTTP_STATUS, REFRESH_COOKIE_NAME } from "../helpers/constants.js";
import db from "../db/db.js";
import { sessions } from "../db/schema/schema.js";
import { eq } from "drizzle-orm";
import { signInRefreshCookieOptions } from "../helpers/helpers.js";

export default async function logoutController(req: Request, res: Response) {
  // Check if the cookie has the refresh-token?
  const validRefreshCookieParseResult = z
    .jwt()
    .safeParse(req.cookies[REFRESH_COOKIE_NAME] ?? "");
  if (validRefreshCookieParseResult.success) {
    // If found, Check if it is in db => If true then delete from DB
    const foundCookie = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refresh, validRefreshCookieParseResult.data));

    if (foundCookie.length) {
      await db
        .delete(sessions)
        .where(eq(sessions.refresh, validRefreshCookieParseResult.data));
    }
  }
  // Delete user's client side cookie by sending an empty cookie
  res.cookie(REFRESH_COOKIE_NAME, "", signInRefreshCookieOptions(0));
  // Send success response
  return res.sendStatus(HTTP_STATUS.success);
}

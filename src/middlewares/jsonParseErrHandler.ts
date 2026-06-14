import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../helpers/constants.js";

export default function jsonParseErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError) {
    return res.status(HTTP_STATUS.badRequest).json({ error: "Invalid Json" });
  }
  next(err);
}

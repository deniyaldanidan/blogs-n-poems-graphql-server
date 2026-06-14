import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../helpers/custom_errors.js";
import { HTTP_STATUS } from "../helpers/constants.js";

export default function unauthorizedErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof UnAuthorizedError) {
    return res.status(HTTP_STATUS.unauthorized).json({ error: err.message });
  }
  next(err);
}

import { NextFunction, Request, Response } from "express";
import { ResourceNotFoundError } from "../helpers/custom_errors.js";

export default function resourceNotFoundErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ResourceNotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  next(err);
}

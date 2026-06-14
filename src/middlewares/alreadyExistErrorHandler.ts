import { NextFunction, Request, Response } from "express";
import { AlreadyExistError } from "../helpers/custom_errors.js";
import { APP_JSON_RESPONSES, HTTP_STATUS } from "../helpers/constants.js";

export default function alreadyExistErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AlreadyExistError) {
    return res
      .status(HTTP_STATUS.conflict)
      .json(APP_JSON_RESPONSES.err(err.message));
  }

  next(err);
}

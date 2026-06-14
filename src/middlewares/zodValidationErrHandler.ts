import { NextFunction, Request, Response } from "express";
import { ZodError, flattenError } from "zod";
import { APP_JSON_RESPONSES, HTTP_STATUS } from "../helpers/constants.js";
import { zodErrFormatter } from "../helpers/helpers.js";

export default function zodValidationErrHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    const errObj = zodErrFormatter(flattenError(err));
    return res
      .status(HTTP_STATUS.badRequest)
      .json(APP_JSON_RESPONSES.err(errObj));
  }

  next(err);
}

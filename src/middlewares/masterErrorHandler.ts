import { Request, Response, NextFunction } from "express";
import { APP_JSON_RESPONSES, HTTP_STATUS } from "../helpers/constants.js";

export default function masterErrorHandler(
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  console.log(error);
  return res
    .status(HTTP_STATUS.serverError)
    .json(APP_JSON_RESPONSES.err("Unknown error happened"));
}

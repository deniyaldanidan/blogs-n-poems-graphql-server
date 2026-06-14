import { Request, Response, NextFunction } from "express";
import { CredentialsMissingErr } from "../helpers/custom_errors.js";

export default function credentialsMissingErrHandler(
  err: Error,
  _: Request,
  __: Response,
  next: NextFunction,
) {
  if (err instanceof CredentialsMissingErr) {
    console.error("Credentials are missing in .env");
    process.exit(1);
  }

  next(err);
}

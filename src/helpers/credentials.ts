import "dotenv/config";
import { CredentialsMissingErr } from "./custom_errors.js";

export function getDB_URL(): string {
  const DB_URL = process.env.DATABASE_URL;
  if (typeof DB_URL == "string" && DB_URL.length) {
    return DB_URL;
  }
  throw new CredentialsMissingErr("DB_URL is missing");
}

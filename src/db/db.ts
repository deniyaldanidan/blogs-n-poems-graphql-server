import { drizzle } from "drizzle-orm/mysql2";
import { getDB_URL } from "../helpers/credentials.js";

const db = drizzle({ connection: { uri: getDB_URL() } });

export default db;

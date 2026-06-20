import z from "zod";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";
import db from "../../../../db/db.js";
import { poems, users } from "../../../../db/schema/schema.js";
import { and, eq } from "drizzle-orm";
// import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function getPoem(_: any, args: { id: number }) {
  const parseIdRes = z.int().safeParse(args.id);
  if (!parseIdRes.success) {
    throw new GqlOperationFailedError("Invalid Id");
  }
  const parsedId = parseIdRes.data;
  const foundPoem = await db
    .select({
      id: poems.id,
      title: poems.title,
      content: poems.content,
      createdAt: poems.createdAt,
      updatedAt: poems.updatedAt,
      author: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
    })
    .from(poems)
    .where(and(eq(poems.id, parsedId), eq(poems.archive, false)))
    .leftJoin(users, eq(users.id, poems.userId));
  return foundPoem[0];
}

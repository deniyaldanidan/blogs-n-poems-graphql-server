import { eq, or } from "drizzle-orm";
import db from "../../../../db/db.js";
import { poems, users } from "../../../../db/schema/schema.js";

export default async function getPoems(_: any, args?: { by?: string }) {
  const conditions = [];
  conditions.push(eq(poems.archive, false));
  if (args?.by?.length) {
    const foundAuthor = await db
      .select()
      .from(users)
      .where(or(eq(users.username, args.by), eq(users.id, args.by)));
    if (!foundAuthor.length) {
      return [];
    }
    conditions.push(eq(poems.userId, foundAuthor[0].id));
  }
  const foundPoems = await db
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
    .where(conditions.length ? conditions[0] : undefined)
    .leftJoin(users, eq(users.id, poems.userId));
  return foundPoems;
}

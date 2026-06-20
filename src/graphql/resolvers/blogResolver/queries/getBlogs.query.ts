import { and, eq, or } from "drizzle-orm";
import db from "../../../../db/db.js";
import { blogs, users } from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";

export default async function getBlogs(
  _: any,
  args: { by: string | undefined },
  ___: AppContext,
) {
  const conditions = [];
  conditions.push(eq(blogs.archive, false));
  if (args?.by?.length) {
    const foundAuthor = await db
      .select()
      .from(users)
      .where(or(eq(users.id, args.by), eq(users.username, args.by)));
    if (!foundAuthor.length) {
      // throw new GqlNotFoundError("Requested user not found");
      return [];
    }
    const foundAuthorId = foundAuthor[0].id;
    conditions.push(eq(blogs.userId, foundAuthorId));
  }
  const blogsData = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      description: blogs.description,
      content: blogs.content,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      userId: blogs.userId,
      author: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
    })
    .from(blogs)
    .where(conditions.length ? and(...conditions) : undefined)
    .leftJoin(users, eq(users.id, blogs.userId));
  return blogsData;
}

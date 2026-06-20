import { and, eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import { blogs, users } from "../../../../db/schema/schema.js";

export default async function getBlog(_: any, args: { id: number }) {
  const blog = await db
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
    .where(and(eq(blogs.id, args.id), eq(blogs.archive, false)))
    .leftJoin(users, eq(users.id, blogs.userId));
  return blog[0];
}

import { and, eq, inArray } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  blogComments,
  blogLikes,
  blogs,
  users,
} from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getMyBlogComments(
  _: any,
  __: {},
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("You're not authenticated!", false);
  }
  const myComments = await db
    .select({
      id: blogComments.id,
      blogId: blogComments.blogId,
      commentContent: blogComments.content,
      createdAt: blogComments.createdAt,
      updatedAt: blogComments.updatedAt,
      blog: {
        id: blogs.id,
        title: blogs.title,
        description: blogs.description,
        content: blogs.content,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        likes: db.$count(blogLikes, eq(blogLikes.blogId, blogs.id)),
        author: {
          name: users.name,
          username: users.username,
          joinedAt: users.joinedAt,
          about: users.about,
        } as any,
      },
    })
    .from(blogComments)
    .where(and(eq(blogComments.userId, ctx.userId), eq(blogs.archive, false)))
    .leftJoin(blogs, eq(blogs.id, blogComments.blogId))
    .leftJoin(users, eq(users.id, blogs.userId));

  const ids: Array<number> = [
    ...new Set(myComments.map((dt) => dt.blogId)),
  ] as any;

  let fetchedComments = [] as any[];
  if (ids.length) {
    fetchedComments = await db
      .select({
        id: blogComments.id,
        blogId: blogComments.blogId,
        commentedBy: {
          name: users.name,
          username: users.username,
          joinedAt: users.joinedAt,
          about: users.about,
        },
        commentContent: blogComments.content,
        createdAt: blogComments.createdAt,
        updatedAt: blogComments.updatedAt,
      })
      .from(blogComments)
      .where(inArray(blogComments.blogId, ids))
      .leftJoin(users, eq(users.id, blogComments.userId));
  }

  const transformedData = myComments.map((dt: any) => {
    const currComments = fetchedComments.filter(
      (cm) => cm.blogId === dt.blogId,
    );

    return { ...dt, blog: { ...dt.blog, comments: currComments } };
  });
  return transformedData;
}

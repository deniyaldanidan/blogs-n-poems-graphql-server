import { and, eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  blogComments,
  blogLikes,
  blogs,
  users,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function getMyBlog(
  _: any,
  args: { id: number },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }
  if (!hasRoles(ctx.role, [userRolesObj.blogger])) {
    throw new GqlForbiddenError("User not a Blogger", false);
  }
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
      likes: db.$count(blogLikes, eq(blogLikes.blogId, blogs.id)),
    })
    .from(blogs)
    .where(and(eq(blogs.id, args.id), eq(blogs.userId, ctx.userId)))
    .leftJoin(users, eq(users.id, blogs.userId));

  if (!blog.length) {
    throw new GqlNotFoundError("requested blog not found", false);
  }

  const fetchedComments = await db
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
    .where(eq(blogComments.blogId, args.id))
    .leftJoin(users, eq(users.id, blogComments.userId));

  return { ...blog[0], comments: fetchedComments };
}

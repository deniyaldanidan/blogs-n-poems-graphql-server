import { eq, inArray } from "drizzle-orm";
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

export default async function getMyBlogs(_: any, __: {}, ctx: AppContext) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }
  if (!hasRoles(ctx.role, [userRolesObj.blogger])) {
    throw new GqlForbiddenError("You don't have blogger role", false);
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
      likes: db.$count(blogLikes, eq(blogLikes.blogId, blogs.id)),
      archive: blogs.archive,
    })
    .from(blogs)
    .where(eq(blogs.userId, ctx.userId))
    .leftJoin(users, eq(users.id, blogs.userId));

  const ids = blogsData.map((dt) => dt.id);
  // console.log(ids);
  let fetchedComments: any[];
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
  } else {
    fetchedComments = [];
  }

  const transformedData = blogsData.map((dt) => {
    const currComments = fetchedComments.filter((cm) => cm.blogId === dt.id);
    return { ...dt, comments: currComments.length ? currComments : [] };
  });
  return transformedData;
}

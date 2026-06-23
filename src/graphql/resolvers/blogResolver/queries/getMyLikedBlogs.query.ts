import { eq, inArray } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  blogComments,
  blogLikes,
  blogs,
  users,
} from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getMyLikedBlogs(_: any, __: {}, ctx: AppContext) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }

  const likedBlogs = await db
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
    .from(blogLikes)
    .where(eq(blogLikes.userId, ctx.userId))
    .leftJoin(blogs, eq(blogs.id, blogLikes.blogId))
    .leftJoin(users, eq(users.id, blogs.userId));

  const parsedIds = likedBlogs.map((dt) => dt.id);
  const ids = parsedIds.filter((id) => id !== null);
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

  const transformedData = likedBlogs.map((dt) => {
    const currComments = fetchedComments.filter((cm) => cm.blogId === dt.id);
    return { ...dt, comments: currComments.length ? currComments : [] };
  });
  return transformedData;
}

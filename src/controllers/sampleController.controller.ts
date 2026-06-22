import { Request, Response } from "express";
import db from "../db/db.js";
import { blogComments, blogLikes, blogs, users } from "../db/schema/schema.js";
import { eq, inArray, or } from "drizzle-orm";

export default async function sampleController(req: Request, res: Response) {
  const data = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      description: blogs.description,
      content: blogs.content,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      author: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      likes: db.$count(blogLikes, eq(blogLikes.blogId, blogs.id)),
    })
    .from(blogs)
    .leftJoin(users, eq(users.id, blogs.userId));
  //   console.log(data.map((dt) => dt.id));

  const ids = data.map((dt) => dt.id);
  console.log(ids);
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

  const transformedData = data.map((dt) => {
    const currComments = fetchedComments.filter((cm) => cm.blogId === dt.id);
    return { ...dt, comments: currComments.length ? currComments : [] };
  });

  return res.json({ blogs: transformedData });
}

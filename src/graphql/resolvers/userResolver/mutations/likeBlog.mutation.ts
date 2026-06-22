import { and, eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import { blogLikes, blogs } from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import { operationSuccessReturn } from "../../../../helpers/helpers.js";

export default async function likeBlog(
  _: any,
  args: { blogid: number },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("You're not authenticated");
  }
  // Check if that blog exists
  const foundBlog = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, args.blogid));
  if (!foundBlog.length) {
    throw new GqlNotFoundError("Requested blog not found");
  }
  // Check if the User already liked that blog
  const alreadyLiked = await db
    .select()
    .from(blogLikes)
    .where(
      and(eq(blogLikes.blogId, args.blogid), eq(blogLikes.userId, ctx.userId)),
    );
  // If he did, delete like
  let action: "liked" | "unliked";
  if (alreadyLiked.length) {
    await db
      .delete(blogLikes)
      .where(
        and(
          eq(blogLikes.blogId, args.blogid),
          eq(blogLikes.userId, ctx.userId),
        ),
      );
    action = "unliked";
  } else {
    // If not create like
    await db
      .insert(blogLikes)
      .values({ blogId: args.blogid, userId: ctx.userId });
    action = "liked";
  }
  return operationSuccessReturn(`You've ${action} blog id: ${args.blogid}`);
}

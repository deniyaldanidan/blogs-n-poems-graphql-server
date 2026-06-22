import z, { flattenError } from "zod";
import { AppContext } from "../../../../helpers/types.js";
import { addCommentZodSchema } from "../../../../zodSchemas/commentZodSchema.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import db from "../../../../db/db.js";
import { blogComments, blogs } from "../../../../db/schema/schema.js";
import { eq } from "drizzle-orm";
import GqlZodError from "../../../errors/GqlZodError.js";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import { operationSuccessReturn } from "../../../../helpers/helpers.js";

export default async function addBlogComment(
  _: any,
  args: { data: z.infer<typeof addCommentZodSchema> },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not Authenticated");
  }
  // validate the data
  const dataValidationResult = addCommentZodSchema.safeParse(args.data);
  if (!dataValidationResult.success) {
    throw new GqlZodError(
      "Invalid input values",
      flattenError(dataValidationResult.error),
    );
  }
  const { data } = dataValidationResult;
  // Check if blog exists
  const foundBlog = await db.select().from(blogs).where(eq(blogs.id, data.id));
  if (!foundBlog.length) {
    throw new GqlNotFoundError("Requested blog not found!");
  }
  // Create the comment
  await db
    .insert(blogComments)
    .values({ blogId: data.id, content: data.comment, userId: ctx.userId });

  return operationSuccessReturn(`You're commented on blog id: ${data.id}`);
}

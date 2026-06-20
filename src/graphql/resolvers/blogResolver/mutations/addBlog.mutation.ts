import z, { flattenError } from "zod";
import { addBlogZodSchema } from "../../../../zodSchemas/blogZodSchema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import { blogs } from "../../../../db/schema/schema.js";

export default async function addBlog(
  _: any,
  args: { data: z.infer<typeof addBlogZodSchema> },
  ctx: AppContext,
  __: any,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }

  if (!hasRoles(ctx.role, [userRolesObj.blogger])) {
    throw new GqlForbiddenError();
  }

  const parsedResult = addBlogZodSchema.safeParse(args.data);
  if (!parsedResult.success) {
    throw new GqlZodError(
      "Invalid input values",
      flattenError(parsedResult.error),
    );
  }
  const blogData = parsedResult.data;
  const blogId = await db
    .insert(blogs)
    .values({
      title: blogData.title,
      description: blogData.description,
      userId: ctx.userId,
      content: blogData.content,
    })
    .$returningId();
  return blogId[0].id;
}

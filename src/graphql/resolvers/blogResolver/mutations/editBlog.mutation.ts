import z, { flattenError } from "zod";
import { AppContext } from "../../../../helpers/types.js";
import { editBlogZodSchema } from "../../../../zodSchemas/blogZodSchema.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import db from "../../../../db/db.js";
import {
  blogs,
  poemBlogCorrectionRequests,
} from "../../../../db/schema/schema.js";
import { and, eq, ne } from "drizzle-orm";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import GqlZodError from "../../../errors/GqlZodError.js";

export default async function editBlog(
  _: any,
  args: { id: number; data: z.infer<typeof editBlogZodSchema> },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  if (!hasRoles(ctx.role, [userRolesObj.blogger])) {
    throw new GqlForbiddenError();
  }
  const dataValidationResult = editBlogZodSchema.safeParse(args.data);
  if (!dataValidationResult.success) {
    throw new GqlZodError(
      "Input validation failed",
      flattenError(dataValidationResult.error),
    );
  }
  const { data } = dataValidationResult;
  const foundBlog = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.id, args.id), eq(blogs.userId, ctx.userId)));
  if (!foundBlog.length) {
    throw new GqlNotFoundError("Requested blog not found");
  }
  await db.update(blogs).set(data).where(eq(blogs.id, args.id));

  const foundCorrection = await db
    .select()
    .from(poemBlogCorrectionRequests)
    .where(
      and(
        eq(poemBlogCorrectionRequests.contentId, args.id),
        eq(poemBlogCorrectionRequests.contentType, "blog"),
        eq(poemBlogCorrectionRequests.userId, ctx.userId),
        ne(poemBlogCorrectionRequests.status, "corrected"),
      ),
    );
  if (foundCorrection.length) {
    await db
      .update(poemBlogCorrectionRequests)
      .set({ status: "edited" })
      .where(
        and(
          eq(poemBlogCorrectionRequests.contentId, args.id),
          eq(poemBlogCorrectionRequests.contentType, "blog"),
          eq(poemBlogCorrectionRequests.userId, ctx.userId),
          ne(poemBlogCorrectionRequests.status, "corrected"),
        ),
      );
  }

  return args.id;
}

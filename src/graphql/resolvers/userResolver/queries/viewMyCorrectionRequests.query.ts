import { and, eq, inArray } from "drizzle-orm";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext, ContentEnumType } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import {
  blogs,
  poemBlogCorrectionRequests,
  poems,
  users,
} from "../../../../db/schema/schema.js";
import db from "../../../../db/db.js";

export default async function viewMyCorrectionRequests(
  _: any,
  args: { type?: ContentEnumType },
  ctx: AppContext,
) {
  // Check if user is Authed
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }
  // Check if he has any "blogger" | "poet" roles
  if (!hasRoles(ctx.role, [userRolesObj.blogger, userRolesObj.poet])) {
    throw new GqlForbiddenError("User not a Blogger or Poet", false);
  }
  const conditions = [];
  conditions.push(eq(poemBlogCorrectionRequests.userId, ctx.userId));
  // if type is provided add it to the conditions array
  if (args.type?.length) {
    conditions.push(eq(poemBlogCorrectionRequests.contentType, args.type));
  }
  // fetch the Corrections
  const corrections = await db
    .select({
      id: poemBlogCorrectionRequests.id,
      correction: poemBlogCorrectionRequests.correction,
      contentId: poemBlogCorrectionRequests.contentId,
      contentType: poemBlogCorrectionRequests.contentType,
      user: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      deadline: poemBlogCorrectionRequests.deadline,
      updatedAt: poemBlogCorrectionRequests.updatedAt,
      status: poemBlogCorrectionRequests.status,
    })
    .from(poemBlogCorrectionRequests)
    .where(and(...conditions))
    .leftJoin(users, eq(users.id, poemBlogCorrectionRequests.userId));

  // Fetching the correctionContent
  const blogIds = corrections
    .filter((dt) => dt.contentType === "blog")
    .map((dt) => dt.contentId);
  const poemIds = corrections
    .filter((dt) => dt.contentType === "poem")
    .map((dt) => dt.contentId);
  let corrBlogs: any[] = [];
  if (blogIds.length) {
    corrBlogs = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        description: blogs.description,
        content: blogs.content,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        archive: blogs.archive,
      })
      .from(blogs)
      .where(inArray(blogs.id, blogIds));
  }
  let corrPoems: any[] = [];
  if (poemIds.length) {
    corrPoems = await db
      .select({
        id: poems.id,
        title: poems.title,
        content: poems.content,
        createdAt: poems.createdAt,
        updatedAt: poems.updatedAt,
        archive: poems.archive,
      })
      .from(poems)
      .where(inArray(poems.id, poemIds));
  }
  const formattedData = corrections.map((dt) => {
    let currCorrectionContent;
    if (dt.contentType === "blog") {
      currCorrectionContent = corrBlogs.find((bl) => bl.id === dt.contentId);
    } else {
      currCorrectionContent = corrPoems.find((bl) => bl.id === dt.contentId);
    }
    return { ...dt, correctionContent: currCorrectionContent };
  });
  return formattedData;
}

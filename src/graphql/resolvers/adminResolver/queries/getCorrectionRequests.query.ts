import { eq } from "drizzle-orm";
import {
  poemBlogCorrectionRequests,
  users,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext, ContentEnumType } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import db from "../../../../db/db.js";

export default async function getCorrectionRequests(
  _: any,
  args: { type?: ContentEnumType },
  ctx: AppContext,
) {
  // Check if user is Authed
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }
  // Check if ADMIN?
  if (!hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError("Only Admin allowed", false);
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
    .where(
      args.type?.length
        ? eq(poemBlogCorrectionRequests.contentType, args.type)
        : undefined,
    )
    .leftJoin(users, eq(users.id, poemBlogCorrectionRequests.userId));
  return corrections;
}

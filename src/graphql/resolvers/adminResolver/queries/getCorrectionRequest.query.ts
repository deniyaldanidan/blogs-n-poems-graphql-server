import { eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  poemBlogCorrectionRequests,
  users,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getCorrectionRequest(
  _: any,
  args: { id: number },
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
    .where(eq(poemBlogCorrectionRequests.id, args.id))
    .leftJoin(users, eq(users.id, poemBlogCorrectionRequests.userId));
  return corrections[0];
}

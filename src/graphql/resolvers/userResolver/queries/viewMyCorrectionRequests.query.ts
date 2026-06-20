import { and, eq } from "drizzle-orm";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext, ContentEnumType } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import {
  poemBlogCorrectionRequests,
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
  // fetch the Corrections
  return corrections;
}

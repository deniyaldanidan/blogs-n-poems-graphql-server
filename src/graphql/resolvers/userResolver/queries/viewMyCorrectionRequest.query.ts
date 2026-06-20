import { and, eq } from "drizzle-orm";
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

export default async function viewMyCorrectionRequest(
  _: any,
  args: { id: number },
  ctx: AppContext,
) {
  // Check if user is authed?
  if (!ctx.auth) {
    throw new GqlUnAuthedError("Not Authenticated", false);
  }
  // Check if user has Blogger or Poet role
  if (!hasRoles(ctx.role, [userRolesObj.blogger, userRolesObj.poet])) {
    throw new GqlForbiddenError("User not a Blogger or Poet", false);
  }
  // fetch his request
  const req = await db
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
      and(
        eq(poemBlogCorrectionRequests.userId, ctx.userId),
        eq(poemBlogCorrectionRequests.id, args.id),
      ),
    )
    .leftJoin(users, eq(users.id, poemBlogCorrectionRequests.userId));
  return req[0];
}

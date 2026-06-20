import z from "zod";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";
import db from "../../../../db/db.js";
import { poetBloggerRequests, users } from "../../../../db/schema/schema.js";
import { eq } from "drizzle-orm";

export default async function getPoetBloggerRequest(
  _: any,
  args: { id: number },
  ctx: AppContext,
) {
  // Check if the user is Authed & has the Admin ROLE
  if (!ctx.auth || !hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError("Forbidden request", false);
  }
  const reqIdParseResult = z.int().safeParse(args.id);
  if (!reqIdParseResult.success) {
    throw new GqlOperationFailedError("Invalid id", false);
  }

  const result = await db
    .select({
      id: poetBloggerRequests.id,
      sample: poetBloggerRequests.sample,
      requestedDate: poetBloggerRequests.requestDate,
      status: poetBloggerRequests.status,
      role: poetBloggerRequests.role,
      requestedBy: {
        name: users.name,
        joinedAt: users.joinedAt,
        about: users.about,
        username: users.username,
      },
    })
    .from(poetBloggerRequests)
    .where(eq(poetBloggerRequests.id, reqIdParseResult.data))
    .leftJoin(users, eq(users.id, poetBloggerRequests.userId));
  return result[0];
}

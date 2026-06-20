import { and, eq } from "drizzle-orm";
import { poetBloggerRequests, users } from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import {
  AppContext,
  PoetBloggerReqStatusEnumType,
  PoetBloggerRoleEnumType,
} from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import db from "../../../../db/db.js";

export default async function getPoetBloggerRequests(
  _: any,
  args: {
    status: PoetBloggerReqStatusEnumType | null;
    role: PoetBloggerRoleEnumType | null;
  },
  ctx: AppContext,
) {
  // console.log(args.status, args.role);
  // Should be an Admin
  if (!ctx.auth || !hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError("Forbidden request", false);
  }
  const conditions = [];
  if (args.status) {
    conditions.push(eq(poetBloggerRequests.status, args.status));
  }
  if (args.role) {
    conditions.push(eq(poetBloggerRequests.role, args.role));
  }
  const results = await db
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
    .where(conditions.length ? and(...conditions) : undefined)
    .leftJoin(users, eq(users.id, poetBloggerRequests.userId));
  return results;
}

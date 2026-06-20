import { and, eq } from "drizzle-orm";
import {
  AppContext,
  PoetBloggerRoleEnumType,
} from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import { poetBloggerRequests, users } from "../../../../db/schema/schema.js";
import db from "../../../../db/db.js";

export default async function viewMyPoetBloggerRequests(
  _: any,
  args: { role?: PoetBloggerRoleEnumType },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("Not Authenticated", false);
  }
  const conditions = [];
  conditions.push(eq(poetBloggerRequests.userId, ctx.userId));
  if (args.role?.length) {
    conditions.push(eq(poetBloggerRequests.role, args.role));
  }
  const myReqs = await db
    .select({
      id: poetBloggerRequests.id,
      sample: poetBloggerRequests.sample,
      requestedBy: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      requestedDate: poetBloggerRequests.requestDate,
      status: poetBloggerRequests.status,
      role: poetBloggerRequests.role,
    })
    .from(poetBloggerRequests)
    .where(and(...conditions))
    .leftJoin(users, eq(users.id, poetBloggerRequests.userId));
  return myReqs;
}

import { and, eq } from "drizzle-orm";
import {
  AppContext,
  // PoetBloggerRoleEnumType,
} from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import { poetBloggerRequests, users } from "../../../../db/schema/schema.js";
import db from "../../../../db/db.js";
import z from "zod";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";
// import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function viewMyPoetBloggerRequest(
  _: any,
  args: { id: number },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("Not Authenticated", false);
  }
  const validIdParserResult = z.int().safeParse(args.id);
  if (!validIdParserResult.success) {
    throw new GqlOperationFailedError("Invalid ID", false);
  }
  const validId = validIdParserResult.data;

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
    .where(
      and(
        eq(poetBloggerRequests.userId, ctx.userId),
        eq(poetBloggerRequests.id, validId),
      ),
    )
    .leftJoin(users, eq(users.id, poetBloggerRequests.userId));
  return myReqs[0];
}

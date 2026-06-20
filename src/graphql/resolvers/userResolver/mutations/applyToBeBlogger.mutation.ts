import { flattenError } from "zod";
import {
  poetBloggerReqRoleEnum,
  userRolesObj,
} from "../../../../helpers/constants.js";
import {
  hasRoles,
  operationSuccessReturn,
} from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import { blogContentZodSchema } from "../../../../zodSchemas/blogZodSchema.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import { poetBloggerRequests } from "../../../../db/schema/schema.js";
import { and, eq } from "drizzle-orm";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";

export default async function applyToBeBlogger(
  _: any,
  args: { sample: string },
  ctx: AppContext,
) {
  // console.log(args.sample);
  // Check if the user is authed?
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  // Check if the user has blogger role?
  if (hasRoles(ctx.role, [userRolesObj.blogger])) {
    throw new GqlForbiddenError("You're already a blogger");
  }
  const sampleParseResult = blogContentZodSchema.safeParse(args.sample);
  if (!sampleParseResult.success) {
    throw new GqlZodError(
      "Invalid input",
      flattenError(sampleParseResult.error),
    );
  }
  // Is he already requested?
  const foundRequest = await db
    .select()
    .from(poetBloggerRequests)
    .where(
      and(
        eq(poetBloggerRequests.role, poetBloggerReqRoleEnum[0]),
        eq(poetBloggerRequests.status, "requested"),
        eq(poetBloggerRequests.userId, ctx.userId),
      ),
    );
  if (foundRequest.length) {
    throw new GqlOperationFailedError("Have already pending request");
  }
  await db.insert(poetBloggerRequests).values({
    sample: sampleParseResult.data,
    userId: ctx.userId,
    role: poetBloggerReqRoleEnum[0],
  });
  return operationSuccessReturn("Application submitted");
}

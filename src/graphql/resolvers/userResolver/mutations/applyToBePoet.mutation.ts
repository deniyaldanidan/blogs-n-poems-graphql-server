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
import { poemContentZodSchema } from "../../../../zodSchemas/poemZodSchema.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import { poetBloggerRequests } from "../../../../db/schema/schema.js";
import { and, eq } from "drizzle-orm";

export default async function applyToBePoet(
  _: any,
  args: { sample: string },
  ctx: AppContext,
) {
  // Check if he's authed and Doesn't has the Poet role
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  if (hasRoles(ctx.role, [userRolesObj.poet])) {
    throw new GqlForbiddenError("You are already a Poet");
  }
  // Validate the data
  const validPoemContent = poemContentZodSchema.safeParse(args.sample);
  if (!validPoemContent.success) {
    throw new GqlZodError(
      "Invalid sample value",
      flattenError(validPoemContent.error),
    );
  }
  // Check if he has already pending requests
  const foundRequests = await db
    .select()
    .from(poetBloggerRequests)
    .where(
      and(
        eq(poetBloggerRequests.userId, ctx.userId),
        eq(poetBloggerRequests.status, "requested"),
      ),
    );
  if (foundRequests.length) {
    throw new GqlOperationFailedError("You already have an pending request");
  }
  // Create the request
  await db.insert(poetBloggerRequests).values({
    sample: validPoemContent.data,
    userId: ctx.userId,
    role: poetBloggerReqRoleEnum[1],
  });
  return operationSuccessReturn("Application submitted");
}

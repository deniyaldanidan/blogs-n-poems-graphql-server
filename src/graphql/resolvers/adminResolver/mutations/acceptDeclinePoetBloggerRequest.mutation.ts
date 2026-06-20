import db from "../../../../db/db.js";
import {
  poetBloggerRequests,
  sessions,
  users,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import {
  hasRoles,
  operationSuccessReturn,
} from "../../../../helpers/helpers.js";
import {
  AdminPoetBloggerReqStatusEnumType,
  AppContext,
} from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import { and, eq } from "drizzle-orm";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import GqlOperationFailedError from "../../../errors/GqlOperationFailedError.js";

export default async function acceptDeclinePoetBloggerRequest(
  _: undefined,
  args: { id: number; status: AdminPoetBloggerReqStatusEnumType },
  ctx: AppContext,
) {
  // Check if the current-user is an ADMIN?
  if (!ctx.auth || !hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError();
  }
  // Check if the Request Already Exist and is in requested-status?
  const foundRequest = await db
    .select()
    .from(poetBloggerRequests)
    .where(
      and(
        eq(poetBloggerRequests.id, args.id),
        eq(poetBloggerRequests.status, "requested"),
      ),
    );
  if (!foundRequest.length) {
    throw new GqlNotFoundError("Requested request not found");
  }
  // If the request status is accepted... make the user the requested role
  if (args.status === "accepted") {
    const requestedUserId = foundRequest[0].userId;
    const requestedRole = foundRequest[0].role;
    const chosenUser = await db
      .select()
      .from(users)
      .where(eq(users.id, requestedUserId));
    if (!chosenUser.length) {
      throw new GqlOperationFailedError("Requested user not found");
    }
    const usersPastRoles = chosenUser[0].role;
    if (
      usersPastRoles &&
      !hasRoles(usersPastRoles, [userRolesObj[requestedRole]])
    ) {
      usersPastRoles.push(userRolesObj[requestedRole]);
    }
    await db
      .update(users)
      .set({ role: usersPastRoles })
      .where(eq(users.id, requestedUserId));
  }
  // Change the status of the request
  await db
    .update(poetBloggerRequests)
    .set({ status: args.status })
    .where(eq(poetBloggerRequests.id, args.id));
  return operationSuccessReturn(
    `Status of request:${args.id} is updated to: ${args.status}`,
  );
}

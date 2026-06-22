import { and, eq, or } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  blogs,
  poemBlogCorrectionRequests,
  poems,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import {
  hasRoles,
  operationSuccessReturn,
} from "../../../../helpers/helpers.js";
import {
  AppContext,
  CorrectionStatusInputEnumType,
} from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function changeCorrectionReqStatus(
  _: any,
  args: { id: number; status: CorrectionStatusInputEnumType },
  ctx: AppContext,
) {
  if (!ctx.auth || !hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError();
  }
  const foundCorrection = await db
    .select()
    .from(poemBlogCorrectionRequests)
    .where(
      and(
        eq(poemBlogCorrectionRequests.id, args.id),
        or(
          eq(poemBlogCorrectionRequests.status, "requested"),
          eq(poemBlogCorrectionRequests.status, "edited"),
        ),
      ),
    );
  if (!foundCorrection.length) {
    throw new GqlNotFoundError("Requested correction not found");
  }
  await db
    .update(poemBlogCorrectionRequests)
    .set({ status: args.status })
    .where(eq(poemBlogCorrectionRequests.id, args.id));
  const contentId = foundCorrection[0].contentId;
  const contentType = foundCorrection[0].contentType;
  if (contentType === "blog") {
    await db
      .update(blogs)
      .set({ archive: args.status === "corrected" ? false : true })
      .where(eq(blogs.id, contentId));
  } else {
    await db
      .update(poems)
      .set({ archive: args.status == "corrected" ? false : true })
      .where(eq(poems.id, contentId));
  }
  return operationSuccessReturn(
    `Status of Correction ${args.id} changed to ${args.status}`,
  );
}

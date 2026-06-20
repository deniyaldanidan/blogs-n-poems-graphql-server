import { flattenError } from "zod";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext, ContentEnumType } from "../../../../helpers/types.js";
import correctionZodSchema from "../../../../zodSchemas/correctionZodSchema.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import {
  blogs,
  poemBlogCorrectionRequests,
  poems,
} from "../../../../db/schema/schema.js";
import { eq } from "drizzle-orm";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function requestCorrectionForPoemOrBlog(
  _: any,
  args: {
    data: {
      correction: string;
      contentId: number;
      contentType: ContentEnumType;
      deadline: Date;
    };
  },
  ctx: AppContext,
) {
  // Check if the user is an ADMIN
  if (!ctx.auth || !hasRoles(ctx.role, [userRolesObj.admin])) {
    throw new GqlForbiddenError();
  }
  // Validate the Data
  const validCorrectionResult = correctionZodSchema.safeParse(
    args.data.correction,
  );
  if (!validCorrectionResult.success) {
    throw new GqlZodError(
      "Invalid correction value",
      flattenError(validCorrectionResult.error),
    );
  }
  const correctionData = validCorrectionResult.data;
  // fetch the relevant blog/poem and get the userId
  let userId: string;
  if (args.data.contentType === "blog") {
    const foundBlog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, args.data.contentId));
    if (!foundBlog.length) {
      throw new GqlNotFoundError("Requested blog not found");
    }
    userId = foundBlog[0].userId;
  } else {
    const foundPoem = await db
      .select()
      .from(poems)
      .where(eq(poems.id, args.data.contentId));
    if (!foundPoem.length) {
      throw new GqlNotFoundError("Requested poem not found");
    }
    userId = foundPoem[0].userId;
  }
  // Create the Correction-Request
  //   console.log(args.data.deadline);
  const newCorrection = await db
    .insert(poemBlogCorrectionRequests)
    .values({
      correction: correctionData,
      userId,
      contentType: args.data.contentType,
      contentId: args.data.contentId,
      deadline: args.data.deadline,
    })
    .$returningId();
  return newCorrection[0].id;
}

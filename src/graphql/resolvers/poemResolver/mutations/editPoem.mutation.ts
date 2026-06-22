import z, { flattenError } from "zod";
import { AppContext } from "../../../../helpers/types.js";
import { editPoemZodSchema } from "../../../../zodSchemas/poemZodSchema.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import {
  poemBlogCorrectionRequests,
  poems,
} from "../../../../db/schema/schema.js";
import { and, eq, ne } from "drizzle-orm";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";

export default async function editPoem(
  _: any,
  args: { id: number; data: z.infer<typeof editPoemZodSchema> },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  if (!hasRoles(ctx.role, [userRolesObj.poet])) {
    throw new GqlForbiddenError();
  }
  const dataValidationResult = editPoemZodSchema.safeParse(args.data);
  if (!dataValidationResult.success) {
    throw new GqlZodError(
      "Invalid Input values",
      flattenError(dataValidationResult.error),
    );
  }
  const { data } = dataValidationResult;
  const foundPoem = await db
    .select()
    .from(poems)
    .where(and(eq(poems.id, args.id), eq(poems.userId, ctx.userId)));
  if (!foundPoem.length) {
    throw new GqlNotFoundError("Requested poem not found");
  }
  await db.update(poems).set(data).where(eq(poems.id, args.id));
  const foundCorrection = await db
    .select()
    .from(poemBlogCorrectionRequests)
    .where(
      and(
        eq(poemBlogCorrectionRequests.contentType, "poem"),
        eq(poemBlogCorrectionRequests.contentId, args.id),
        eq(poemBlogCorrectionRequests.userId, ctx.userId),
        ne(poemBlogCorrectionRequests.status, "corrected"),
      ),
    );
  if (foundCorrection.length) {
    await db
      .update(poemBlogCorrectionRequests)
      .set({ status: "edited" })
      .where(
        and(
          eq(poemBlogCorrectionRequests.contentType, "poem"),
          eq(poemBlogCorrectionRequests.contentId, args.id),
          eq(poemBlogCorrectionRequests.userId, ctx.userId),
          ne(poemBlogCorrectionRequests.status, "corrected"),
        ),
      );
  }
  return args.id;
}

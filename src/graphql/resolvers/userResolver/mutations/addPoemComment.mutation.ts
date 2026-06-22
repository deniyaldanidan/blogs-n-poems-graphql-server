import z, { flattenError } from "zod";
import { AppContext } from "../../../../helpers/types.js";
import { addCommentZodSchema } from "../../../../zodSchemas/commentZodSchema.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import { poemComments, poems } from "../../../../db/schema/schema.js";
import { eq } from "drizzle-orm";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import { operationSuccessReturn } from "../../../../helpers/helpers.js";

export default async function addPoemComment(
  _: any,
  args: { data: z.infer<typeof addCommentZodSchema> },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not Authenticated!");
  }
  // validate the data
  const dataValidationResult = addCommentZodSchema.safeParse(args.data);
  if (!dataValidationResult.success) {
    throw new GqlZodError(
      "Invalid input values",
      flattenError(dataValidationResult.error),
    );
  }
  const { data } = dataValidationResult;
  // check if poem exists
  const foundPoem = await db.select().from(poems).where(eq(poems.id, data.id));
  if (!foundPoem.length) {
    throw new GqlNotFoundError("Requested poem not found!");
  }
  // create the comment
  await db
    .insert(poemComments)
    .values({ poemId: data.id, content: data.comment, userId: ctx.userId });
  return operationSuccessReturn(`You're commented on peom id: ${data.id}`);
}

import z, { flattenError } from "zod";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import { addPoemZodSchema } from "../../../../zodSchemas/poemZodSchema.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import db from "../../../../db/db.js";
import { poems } from "../../../../db/schema/schema.js";

export default async function addPoem(
  _: any,
  args: { data: z.infer<typeof addPoemZodSchema> },
  ctx: AppContext,
) {
  // Check if the user is Authenticated
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  // Check if the user has Poet Role
  if (!hasRoles(ctx.role, [userRolesObj.poet])) {
    throw new GqlForbiddenError();
  }
  // Validate the DATA
  const dataValidResult = addPoemZodSchema.safeParse(args.data);
  if (!dataValidResult.success) {
    throw new GqlZodError(
      "Invalid input values",
      flattenError(dataValidResult.error),
    );
  }
  const data = dataValidResult.data;
  // Create poem
  const newPoemId = await db
    .insert(poems)
    .values({
      title: data.title,
      content: data.content,
      userId: ctx.userId,
    })
    .$returningId();
  // Send POEM-ID
  return newPoemId[0].id;
}

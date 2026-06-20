import { flattenError } from "zod";
import db from "../../../../db/db.js";
import { AppContext } from "../../../../helpers/types.js";
import userInfoZodSchema from "../../../../zodSchemas/userInfoZodSchema.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlZodError from "../../../errors/GqlZodError.js";
import { users } from "../../../../db/schema/schema.js";
import { eq } from "drizzle-orm";
import { operationSuccessReturn } from "../../../../helpers/helpers.js";

export default async function editUserInfo(
  _: any,
  args: { name: string; about: string },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError();
  }
  // validate the DATA
  const dataValidResult = userInfoZodSchema.safeParse(args);
  if (!dataValidResult.success) {
    throw new GqlZodError(
      "Invalid input values",
      flattenError(dataValidResult.error),
    );
  }
  // update the info
  const userData = dataValidResult.data;
  await db
    .update(users)
    .set({ name: userData.name, about: userData.about })
    .where(eq(users.id, ctx.userId));

  // return success-object
  return operationSuccessReturn("User-Info is updated successfully");
}

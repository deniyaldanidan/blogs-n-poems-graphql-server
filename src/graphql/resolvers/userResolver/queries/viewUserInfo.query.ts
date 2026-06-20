import { eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import { users } from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function viewUserInfo(_: any, __: {}, ctx: AppContext) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("Not Authenticated", false);
  }
  const reqUser = await db
    .select({
      name: users.name,
      username: users.username,
      email: users.email,
      joinedAt: users.joinedAt,
      about: users.about,
    })
    .from(users)
    .where(eq(users.id, ctx.userId));
  return reqUser[0];
}

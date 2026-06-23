import { and, eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  poemComments,
  poemLikes,
  poems,
  users,
} from "../../../../db/schema/schema.js";
import { userRolesObj } from "../../../../helpers/constants.js";
import { hasRoles } from "../../../../helpers/helpers.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlForbiddenError from "../../../errors/GqlForbiddenError.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getMyPoem(
  _: any,
  args: { id: number },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }
  if (!hasRoles(ctx.role, [userRolesObj.poet])) {
    throw new GqlForbiddenError("User not a Poet", false);
  }
  const foundPoem = await db
    .select({
      id: poems.id,
      title: poems.title,
      content: poems.content,
      createdAt: poems.createdAt,
      updatedAt: poems.updatedAt,
      author: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      likes: db.$count(poemLikes, eq(poemLikes.poemId, poems.id)),
      archive: poems.archive,
    })
    .from(poems)
    .where(and(eq(poems.id, args.id), eq(poems.userId, ctx.userId)))
    .leftJoin(users, eq(users.id, poems.userId));

  const foundComments = await db
    .select({
      id: poemComments.id,
      poemId: poemComments.poemId,
      commentedBy: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      commentContent: poemComments.content,
      createdAt: poemComments.createdAt,
      updatedAt: poemComments.updatedAt,
    })
    .from(poemComments)
    .where(eq(poemComments.poemId, args.id))
    .leftJoin(users, eq(users.id, poemComments.userId));
  return { ...foundPoem[0], comments: foundComments };
}

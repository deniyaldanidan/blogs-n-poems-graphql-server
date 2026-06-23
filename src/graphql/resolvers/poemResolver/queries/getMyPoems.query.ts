import { eq, inArray } from "drizzle-orm";
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

export default async function getMyPoems(_: any, args: {}, ctx: AppContext) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not Authenticated", false);
  }
  if (!hasRoles(ctx.role, [userRolesObj.poet])) {
    throw new GqlForbiddenError("User not a Poet", false);
  }
  const foundPoems = await db
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
    .where(eq(poems.userId, ctx.userId))
    .leftJoin(users, eq(users.id, poems.userId));

  const ids = foundPoems.map((dt) => dt.id);
  // console.log(ids);
  let fetchedComments: any[];
  if (ids.length) {
    fetchedComments = await db
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
      .where(inArray(poemComments.poemId, ids))
      .leftJoin(users, eq(users.id, poemComments.userId));
  } else {
    fetchedComments = [];
  }

  const transformedData = foundPoems.map((dt) => {
    const currComments = fetchedComments.filter((cm) => cm.poemId === dt.id);
    return { ...dt, comments: currComments.length ? currComments : [] };
  });
  return transformedData;
}

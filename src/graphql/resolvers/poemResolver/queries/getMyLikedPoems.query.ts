import { eq, inArray } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  poemComments,
  poemLikes,
  poems,
  users,
} from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getMyLikedPoems(_: any, __: {}, ctx: AppContext) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("User not authenticated", false);
  }

  const likedPoems = await db
    .select({
      id: poems.id,
      title: poems.title,
      content: poems.content,
      createdAt: poems.createdAt,
      updatedAt: poems.updatedAt,
      userId: poems.userId,
      author: {
        name: users.name,
        username: users.username,
        joinedAt: users.joinedAt,
        about: users.about,
      },
      likes: db.$count(poemLikes, eq(poemLikes.poemId, poems.id)),
    })
    .from(poemLikes)
    .where(eq(poemLikes.userId, ctx.userId))
    .leftJoin(poems, eq(poems.id, poemLikes.poemId))
    .leftJoin(users, eq(users.id, poems.userId));

  const parsedIds = likedPoems.map((dt) => dt.id);
  const ids = parsedIds.filter((id) => id !== null);
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

  const transformedData = likedPoems.map((dt) => {
    const currComments = fetchedComments.filter((cm) => cm.poemId === dt.id);
    return { ...dt, comments: currComments.length ? currComments : [] };
  });
  return transformedData;
}

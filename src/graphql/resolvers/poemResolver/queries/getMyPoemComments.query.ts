import { and, eq, inArray } from "drizzle-orm";
import db from "../../../../db/db.js";
import {
  poemComments,
  poemLikes,
  poems,
  users,
} from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";

export default async function getMyPoemComments(
  _: any,
  __: {},
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("You're not authenticated!", false);
  }
  const myComments = await db
    .select({
      id: poemComments.id,
      poemId: poemComments.poemId,
      commentContent: poemComments.content,
      createdAt: poemComments.createdAt,
      updatedAt: poemComments.updatedAt,
      poem: {
        id: poems.id,
        title: poems.title,
        content: poems.content,
        createdAt: poems.createdAt,
        updatedAt: poems.updatedAt,
        likes: db.$count(poemLikes, eq(poemLikes.poemId, poems.id)),
        author: {
          name: users.name,
          username: users.username,
          joinedAt: users.joinedAt,
          about: users.about,
        } as any,
      },
    })
    .from(poemComments)
    .where(and(eq(poemComments.userId, ctx.userId), eq(poems.archive, false)))
    .leftJoin(poems, eq(poems.id, poemComments.poemId))
    .leftJoin(users, eq(users.id, poems.userId));

  const ids: Array<number> = [
    ...new Set(myComments.map((dt) => dt.poemId)),
  ] as any;

  let fetchedComments = [] as any[];
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
  }

  const transformedData = myComments.map((dt: any) => {
    const currComments = fetchedComments.filter(
      (cm) => cm.poemId === dt.poemId,
    );

    return { ...dt, poem: { ...dt.poem, comments: currComments } };
  });
  return transformedData;
}

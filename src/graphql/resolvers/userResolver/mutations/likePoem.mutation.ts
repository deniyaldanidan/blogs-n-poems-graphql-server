import { and, eq } from "drizzle-orm";
import db from "../../../../db/db.js";
import { poemLikes, poems } from "../../../../db/schema/schema.js";
import { AppContext } from "../../../../helpers/types.js";
import GqlUnAuthedError from "../../../errors/GqlUnAuthedError.js";
import GqlNotFoundError from "../../../errors/GqlNotFoundError.js";
import { operationSuccessReturn } from "../../../../helpers/helpers.js";

export default async function likePoem(
  _: any,
  args: { poemId: number },
  ctx: AppContext,
) {
  if (!ctx.auth) {
    throw new GqlUnAuthedError("You're not authentcated!");
  }
  const foundPoem = await db
    .select()
    .from(poems)
    .where(eq(poems.id, args.poemId));
  if (!foundPoem.length) {
    throw new GqlNotFoundError("Requested Poem not found");
  }
  const foundLike = await db
    .select()
    .from(poemLikes)
    .where(
      and(eq(poemLikes.poemId, args.poemId), eq(poemLikes.userId, ctx.userId)),
    );
  let action: "liked" | "unliked";
  if (foundLike.length) {
    await db
      .delete(poemLikes)
      .where(
        and(
          eq(poemLikes.poemId, args.poemId),
          eq(poemLikes.userId, ctx.userId),
        ),
      );
    action = "unliked";
  } else {
    await db
      .insert(poemLikes)
      .values({ poemId: args.poemId, userId: ctx.userId });
    action = "liked";
  }
  return operationSuccessReturn(`You've ${action} poem id: ${args.poemId}`);
}

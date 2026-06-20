import { eq } from "drizzle-orm";
import db from "../../db/db.js";
import { blogs, poems } from "../../db/schema/schema.js";
import { ContentEnumType } from "../../helpers/types.js";

const Correction = {
  async correctionContent(parent: {
    contentId: number;
    contentType: ContentEnumType;
  }) {
    if (parent.contentType === "blog") {
      const data = await db
        .select({
          title: blogs.title,
          description: blogs.description,
          content: blogs.content,
          createdAt: blogs.createdAt,
          updatedAt: blogs.updatedAt,
          archive: blogs.archive,
        })
        .from(blogs)
        .where(eq(blogs.id, parent.contentId));
      return data[0];
    } else {
      const data = await db
        .select({
          title: poems.title,
          content: poems.content,
          createdAt: poems.createdAt,
          updatedAt: poems.updatedAt,
          archive: poems.archive,
        })
        .from(poems)
        .where(eq(poems.id, parent.contentId));
      return data[0];
    }
  },
};

export default Correction;

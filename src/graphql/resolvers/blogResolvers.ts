import { ApolloServerOptionsWithTypeDefs } from "@apollo/server";
import { AppContext } from "../../helpers/types.js";
import z, { flattenError } from "zod";
import { addBlogZodSchema } from "../../zodSchemas/blogZodSchema.js";
import GqlZodError from "../errors/GqlZodError.js";
import { userRolesObj } from "../../helpers/constants.js";
import GqlUnAuthedError from "../errors/GqlUnAuthedError.js";
import GqlForbiddenError from "../errors/GqlForbiddenError.js";
import db from "../../db/db.js";
import { blogs, users } from "../../db/schema/schema.js";
import { eq } from "drizzle-orm";

const blogResolvers: ApolloServerOptionsWithTypeDefs<AppContext>["resolvers"] =
  {
    Mutation: {
      async addBlog(
        _,
        args: { data: z.infer<typeof addBlogZodSchema> },
        ctx,
        __,
      ) {
        // console.log(ctx);
        if (!ctx.auth) {
          throw new GqlUnAuthedError();
        }
        /*
        // turn this ON once you've got an Blogger-Role
        if (ctx.role !== userRolesObj.blogger) {
          throw new GqlForbiddenError();
        }
        */
        const parsedResult = addBlogZodSchema.safeParse(args.data);
        if (!parsedResult.success) {
          throw new GqlZodError(
            "Invalid input values",
            flattenError(parsedResult.error),
          );
        }
        const blogData = parsedResult.data;
        const blogId = await db
          .insert(blogs)
          .values({
            title: blogData.title,
            description: blogData.description,
            userId: ctx.userId,
            content: blogData.content,
          })
          .$returningId();
        return blogId[0].id;
      },
    },
    Query: {
      async getBlogs() {
        const blogsData = await db
          .select({
            id: blogs.id,
            title: blogs.title,
            description: blogs.description,
            content: blogs.content,
            createdAt: blogs.createdAt,
            updatedAt: blogs.updatedAt,
            userId: blogs.userId,
          })
          .from(blogs);
        return blogsData;
      },
      async getBlog(_, args: { id: number }) {
        const blog = await db
          .select({
            id: blogs.id,
            title: blogs.title,
            description: blogs.description,
            content: blogs.content,
            createdAt: blogs.createdAt,
            updatedAt: blogs.updatedAt,
            userId: blogs.userId,
          })
          .from(blogs)
          .where(eq(blogs.id, args.id));
        return blog[0];
      },
    },
    Blog: {
      async author(parent) {
        const authorInfo = await db
          .select({
            name: users.name,
            about: users.about,
            joinedAt: users.joinedAt,
          })
          .from(users)
          .where(eq(users.id, parent.userId));
        return authorInfo[0];
      },
    },
  };

export default blogResolvers;

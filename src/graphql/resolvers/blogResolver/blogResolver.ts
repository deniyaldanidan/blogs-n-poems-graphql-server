import { ApolloResolverType } from "../../../helpers/types.js";
import Blog from "./models/Blog.model.js";
import addBlog from "./mutations/addBlog.mutation.js";
import editBlog from "./mutations/editBlog.mutation.js";
import getBlog from "./queries/getBlog.query.js";
import getBlogs from "./queries/getBlogs.query.js";

const blogResolvers: ApolloResolverType = {
  Mutation: {
    addBlog,
    editBlog,
  },
  Query: {
    getBlogs,
    getBlog,
  },
  Blog,
};

export default blogResolvers;

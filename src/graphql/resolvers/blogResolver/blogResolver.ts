import { ApolloResolverType } from "../../../helpers/types.js";
import Blog from "./models/Blog.model.js";
import addBlog from "./mutations/addBlog.mutation.js";
import editBlog from "./mutations/editBlog.mutation.js";
import getBlog from "./queries/getBlog.query.js";
import getBlogs from "./queries/getBlogs.query.js";
import getMyBlog from "./queries/getMyBlog.query.js";
import getMyBlogComments from "./queries/getMyBlogComments.query.js";
import getMyBlogs from "./queries/getMyBlogs.query.js";
import getMyLikedBlogs from "./queries/getMyLikedBlogs.query.js";

const blogResolvers: ApolloResolverType = {
  Mutation: {
    addBlog,
    editBlog,
  },
  Query: {
    getBlogs,
    getBlog,
    getMyBlogs,
    getMyBlog,
    getMyLikedBlogs,
    getMyBlogComments,
  },
  Blog,
};

export default blogResolvers;

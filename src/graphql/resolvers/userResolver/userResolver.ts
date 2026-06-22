import { ApolloResolverType } from "../../../helpers/types.js";
import PoetBloggerRequest from "./models/PoetBloggerRequest.model.js";
import addBlogComment from "./mutations/addBlogComment.mutation.js";
import addPoemComment from "./mutations/addPoemComment.mutation.js";
import applyToBeBlogger from "./mutations/applyToBeBlogger.mutation.js";
import applyToBePoet from "./mutations/applyToBePoet.mutation.js";
import editUserInfo from "./mutations/editUserInfo.mutation.js";
import likeBlog from "./mutations/likeBlog.mutation.js";
import likePoem from "./mutations/likePoem.mutation.js";
import viewMyCorrectionRequest from "./queries/viewMyCorrectionRequest.query.js";
import viewMyCorrectionRequests from "./queries/viewMyCorrectionRequests.query.js";
import viewMyPoetBloggerRequest from "./queries/viewMyPoetBloggerRequest.query.js";
import viewMyPoetBloggerRequests from "./queries/viewMyPoetBloggerRequests.query.js";
import viewUserInfo from "./queries/viewUserInfo.query.js";

const userResolver: ApolloResolverType = {
  // Mutation starts here
  Mutation: {
    applyToBeBlogger,
    applyToBePoet,
    editUserInfo,
    likeBlog,
    likePoem,
    addBlogComment,
    addPoemComment,
  },
  // Query starts here
  Query: {
    viewUserInfo,
    viewMyPoetBloggerRequests,
    viewMyPoetBloggerRequest,
    viewMyCorrectionRequests,
    viewMyCorrectionRequest,
  },
  // Models comes here
  PoetBloggerRequest,
};

export default userResolver;

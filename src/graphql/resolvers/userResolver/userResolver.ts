import { ApolloResolverType } from "../../../helpers/types.js";
import PoetBloggerRequest from "./models/PoetBloggerRequest.model.js";
import applyToBeBlogger from "./mutations/applyToBeBlogger.mutation.js";
import applyToBePoet from "./mutations/applyToBePoet.mutation.js";
import editUserInfo from "./mutations/editUserInfo.mutation.js";
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
  },
  // Query starts here
  Query: {
    viewUserInfo,
    viewMyPoetBloggerRequests,
    viewMyPoetBloggerRequest,
    viewMyCorrectionRequests,
  },
  // Models comes here
  PoetBloggerRequest,
};

export default userResolver;

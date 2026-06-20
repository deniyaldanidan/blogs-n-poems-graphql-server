import { ApolloResolverType } from "../../../helpers/types.js";
import PoetBloggerRequest from "./models/PoetBloggerRequest.model.js";
import acceptDeclinePoetBloggerRequest from "./mutations/acceptDeclinePoetBloggerRequest.mutation.js";
import requestCorrectionForPoemOrBlog from "./mutations/requestCorrectionForPoemOrBlog.mutation.js";
import getPoetBloggerRequest from "./queries/getPoetBloggerRequest.query.js";
import getPoetBloggerRequests from "./queries/getPoetBloggerRequests.query.js";

const adminResolver: ApolloResolverType = {
  Mutation: {
    acceptDeclinePoetBloggerRequest,
    requestCorrectionForPoemOrBlog,
  },
  Query: {
    getPoetBloggerRequests,
    getPoetBloggerRequest,
  },
  PoetBloggerRequest,
};

export default adminResolver;

import { ApolloResolverType } from "../../../helpers/types.js";
import PoetBloggerRequest from "./models/PoetBloggerRequest.model.js";
import acceptDeclinePoetBloggerRequest from "./mutations/acceptDeclinePoetBloggerRequest.mutation.js";
import changeCorrectionReqStatus from "./mutations/changeCorrectionReqStatus.mutation.js";
import requestCorrectionForPoemOrBlog from "./mutations/requestCorrectionForPoemOrBlog.mutation.js";
import getCorrectionRequest from "./queries/getCorrectionRequest.query.js";
import getCorrectionRequests from "./queries/getCorrectionRequests.query.js";
import getPoetBloggerRequest from "./queries/getPoetBloggerRequest.query.js";
import getPoetBloggerRequests from "./queries/getPoetBloggerRequests.query.js";

const adminResolver: ApolloResolverType = {
  Mutation: {
    acceptDeclinePoetBloggerRequest,
    requestCorrectionForPoemOrBlog,
    changeCorrectionReqStatus,
  },
  Query: {
    getPoetBloggerRequests,
    getPoetBloggerRequest,
    getCorrectionRequests,
    getCorrectionRequest,
  },
  PoetBloggerRequest,
};

export default adminResolver;

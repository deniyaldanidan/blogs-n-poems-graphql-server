import adminResolver from "./adminResolver/adminResolver.js";
import blogResolvers from "./blogResolver/blogResolver.js";
import Correction from "./Correction.model.js";
import dateScalar from "./dateScalar.js";
import poemResolver from "./poemResolver/poemResolver.js";
import userResolver from "./userResolver/userResolver.js";
import _ from "lodash";

const baseResolvers = {
  Date: dateScalar,
  Correction,
};

// const resolvers = { ...blogResolvers, ...userResolver, ...baseResolvers };

const resolvers = _.merge(
  blogResolvers,
  poemResolver,
  userResolver,
  adminResolver,
  baseResolvers,
);

export default resolvers;

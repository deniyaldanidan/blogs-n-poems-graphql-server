import blogResolvers from "./blogResolvers.js";
import dateScalar from "./dateScalar.js";

const baseResolvers = {
  Date: dateScalar,
};

const resolvers = { ...blogResolvers, ...baseResolvers };

export default resolvers;

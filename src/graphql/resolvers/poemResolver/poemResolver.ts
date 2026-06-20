import Poem from "./models/Poem.model.js";
import addPoem from "./mutations/addPoem.mutation.js";
import getPoem from "./queries/getPoem.query.js";
import getPoems from "./queries/getPoems.query.js";

export default {
  Mutation: {
    addPoem,
  },
  Query: {
    getPoems,
    getPoem,
  },
  Poem,
};

import Poem from "./models/Poem.model.js";
import addPoem from "./mutations/addPoem.mutation.js";
import editPoem from "./mutations/editPoem.mutation.js";
import getPoem from "./queries/getPoem.query.js";
import getPoems from "./queries/getPoems.query.js";

export default {
  Mutation: {
    addPoem,
    editPoem,
  },
  Query: {
    getPoems,
    getPoem,
  },
  Poem,
};

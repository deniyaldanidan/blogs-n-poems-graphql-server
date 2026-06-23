import Poem from "./models/Poem.model.js";
import addPoem from "./mutations/addPoem.mutation.js";
import editPoem from "./mutations/editPoem.mutation.js";
import getMyLikedPoems from "./queries/getMyLikedPoems.query.js";
import getMyPoem from "./queries/getMyPoem.query.js";
import getMyPoemComments from "./queries/getMyPoemComments.query.js";
import getMyPoems from "./queries/getMyPoems.query.js";
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
    getMyPoems,
    getMyPoem,
    getMyLikedPoems,
    getMyPoemComments,
  },
  Poem,
};

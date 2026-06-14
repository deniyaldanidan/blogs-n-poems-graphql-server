import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";
import { flattenError } from "zod";
import { zodErrFormatter } from "../../helpers/helpers.js";

export default class GqlZodError extends GraphQLError {
  constructor(
    message: string = "Invalid Input values",
    flattenedError: ReturnType<typeof flattenError>,
  ) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.zodBadUserInput,
        http: { status: HTTP_STATUS.badRequest },
        errDetails: zodErrFormatter(flattenedError),
      },
    });
    this.name = "GQLZodError";
  }
}

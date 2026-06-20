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
    mutation: boolean = true,
  ) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.zodBadUserInput,
        httpStatus: HTTP_STATUS.badRequest,
        http: {
          status: mutation ? HTTP_STATUS.badRequest : HTTP_STATUS.success,
        },
        errDetails: zodErrFormatter(flattenedError),
      },
    });
    this.name = "GQLZodError";
  }
}

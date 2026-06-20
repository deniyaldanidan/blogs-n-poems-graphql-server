import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlOperationFailedError extends GraphQLError {
  constructor(message: string = "Operation failed", mutation: boolean = true) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.badRequest,
        httpStatus: HTTP_STATUS.badRequest,
        http: {
          status: mutation ? HTTP_STATUS.badRequest : HTTP_STATUS.success,
        },
      },
    });
    this.name = "GqlOperationFailedError";
  }
}

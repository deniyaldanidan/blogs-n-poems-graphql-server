import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlForbiddenError extends GraphQLError {
  constructor(message: string = "Forbidden Action", mutation: boolean = true) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.forbidden,
        httpStatus: HTTP_STATUS.forbidden,
        http: {
          status: mutation ? HTTP_STATUS.forbidden : HTTP_STATUS.success,
        },
      },
    });
    this.name = "GraphQlForbiddenError";
  }
}

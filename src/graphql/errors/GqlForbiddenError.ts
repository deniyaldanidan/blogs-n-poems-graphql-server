import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlForbiddenError extends GraphQLError {
  constructor(message: string = "Forbidden Action") {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.forbidden,
        http: { status: HTTP_STATUS.forbidden },
      },
    });
    this.name = "GraphQlForbiddenError";
  }
}

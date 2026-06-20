import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlUnAuthedError extends GraphQLError {
  constructor(message: string = "Not Authenticated", mutation: boolean = true) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.unAuthenticated,
        httpStatus: HTTP_STATUS.unauthorized,
        http: {
          status: mutation ? HTTP_STATUS.unauthorized : HTTP_STATUS.success,
        },
      },
    });
    this.name = "GraphQlUnAuthedError";
  }
}

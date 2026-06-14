import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlUnAuthedError extends GraphQLError {
  constructor(message: string = "Not Authenticated") {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.unAuthenticated,
        http: { status: HTTP_STATUS.unauthorized },
      },
    });
    this.name = "GraphQlUnAuthedError";
  }
}

import { GraphQLError } from "graphql";
import {
  APP_GRAPHQL_ERROR_CODES,
  HTTP_STATUS,
} from "../../helpers/constants.js";

export default class GqlNotFoundError extends GraphQLError {
  constructor(message: string = "Not Found", mutation: boolean = true) {
    super(message, {
      extensions: {
        code: APP_GRAPHQL_ERROR_CODES.notFound,
        httpStatus: HTTP_STATUS.notFound,
        http: { status: mutation ? HTTP_STATUS.notFound : HTTP_STATUS.success },
      },
    });
    this.name = "GqlNotFoundError";
  }
}

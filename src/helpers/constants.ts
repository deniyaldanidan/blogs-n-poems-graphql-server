import { ApolloServerErrorCode } from "@apollo/server/errors";

export const correctionStatusEnum = [
  "requested",
  "edited",
  "corrected",
  "declined",
] as const;

export const correctionStatusInputEnum = ["corrected", "declined"] as const;

export const userRolesEnum = ["1019", "2374", "9802", "9943"] as const;

export const userRolesObj = {
  guest: userRolesEnum[0],
  blogger: userRolesEnum[1],
  poet: userRolesEnum[2],
  admin: userRolesEnum[3],
} as const;

export const poetBloggerReqStatusEnum = [
  "requested",
  "accepted",
  "declined",
] as const;
export const poetBloggerReqRoleEnum = ["blogger", "poet"] as const;

export const contentTypeEnum = ["blog", "poem"] as const;

export const APP_URLS = {
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    refresh: "/refresh",
    logOut: "/log-out",
    base: "/auth",
  },
} as const;

export const HTTP_STATUS = {
  success: 200,
  created: 201,
  serverError: 500,
  badRequest: 400,
  conflict: 409,
  notFound: 404,
  unauthorized: 401,
  forbidden: 409,
} as const;

export const APP_JSON_RESPONSES = {
  err: (errMsg: string | any) => ({ error: errMsg }),
  signedIn: (token: string) => ({ success: true, auth: token }),
};

export const REFRESH_COOKIE_NAME = "session";

export const MAX_ALLOWED_SESSIONS = 3;

export const APP_GRAPHQL_ERROR_CODES = {
  zodBadUserInput: "APP_ZOD_BAD_USER_INPUT",
  unAuthenticated: "APP_NOT_AUTHENTICATED",
  forbidden: "APP_FORBIDDEN_ACTION",
  badRequest: ApolloServerErrorCode.BAD_REQUEST,
  notFound: "RESOURCE_NOT_FOUND",
} as const;

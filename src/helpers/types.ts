// import { BaseContext } from "@apollo/server";
import {
  contentTypeEnum,
  poetBloggerReqRoleEnum,
  poetBloggerReqStatusEnum,
  userRolesEnum,
} from "./constants.js";
import { users } from "../db/schema/schema.js";
import { ApolloServerOptionsWithTypeDefs } from "@apollo/server";

export type UserRoleType = (typeof userRolesEnum)[number];

export type AccessPayloadType = {
  userId: string;
  username: string;
  role: NonNullable<typeof users.$inferSelect.role>;
};

export type RefreshPayloadType = {
  username: string;
};

export type AuthContext = { auth: true } & AccessPayloadType;
export type UnAuthContext = { auth: false };

export type AppContext = AuthContext | UnAuthContext; // Add AuthContext in here
export type PoetBloggerReqStatusEnumType =
  (typeof poetBloggerReqStatusEnum)[number];
export type PoetBloggerRoleEnumType = (typeof poetBloggerReqRoleEnum)[number];

export type ApolloResolverType =
  ApolloServerOptionsWithTypeDefs<AppContext>["resolvers"] & {};

const adminPoetBloggerReqStatusEnum = [
  poetBloggerReqStatusEnum[1],
  poetBloggerReqStatusEnum[2],
];
export type AdminPoetBloggerReqStatusEnumType =
  (typeof adminPoetBloggerReqStatusEnum)[number];

export type ContentEnumType = (typeof contentTypeEnum)[number];

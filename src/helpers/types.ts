// import { BaseContext } from "@apollo/server";
import { userRolesEnum } from "./constants.js";

export type UserRoleType = (typeof userRolesEnum)[number];

export type AccessPayloadType = {
  userId: string;
  username: string;
  role: UserRoleType;
};

export type RefreshPayloadType = {
  username: string;
};

export type AuthContext = { auth: true } & AccessPayloadType;
export type UnAuthContext = { auth: false };

export type AppContext = AuthContext | UnAuthContext; // Add AuthContext in here

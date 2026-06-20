import { CookieOptions } from "express";
import { flattenError } from "zod";
import { AccessPayloadType, UserRoleType } from "./types.js";

export function addDaysFromToday(days: number) {
  return new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
}

export function daysInMilliSeconds(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function signInRefreshCookieOptions(maxAge: number): CookieOptions {
  return { httpOnly: true, secure: false /*true*/, sameSite: "none", maxAge };
}

export function zodErrFormatter(flatErr: ReturnType<typeof flattenError>) {
  const errObj: any = {};
  if (flatErr.formErrors.length) {
    errObj["error"] = flatErr.formErrors[0];
  }
  if (Object.keys(flatErr.fieldErrors).length) {
    Object.keys(flatErr.fieldErrors).forEach((ky: any) => {
      errObj[ky] = (flatErr.fieldErrors as any)[ky][0];
    });
  }
  return errObj;
}

export function hasRoles(
  userRoles: AccessPayloadType["role"],
  acceptedRoles: UserRoleType[],
): boolean {
  return acceptedRoles.some((rl) => userRoles.includes(rl));
}

export function operationSuccessReturn(message: string) {
  return { success: true, message };
}
/*
export function operationFailedReturn(message:string){
  return {}
}
*/

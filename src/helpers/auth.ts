import jwt from "jsonwebtoken";
import "dotenv/config";
import {
  AccessPayloadType,
  AppContext,
  RefreshPayloadType,
  UnAuthContext,
} from "./types.js";
import { addDaysFromToday, daysInMilliSeconds } from "./helpers.js";
import { CredentialsMissingErr } from "./custom_errors.js";
import {
  accessPayloadParser,
  bearerParser,
  jwtParser,
} from "../zodSchemas/jwtZodSchema.js";

export function getAccessSecret() {
  const accessSecret = process.env.ACCESS_SECRET;
  if (!accessSecret) {
    throw new CredentialsMissingErr("ACCESS_SECRET is not provided");
  }
  return accessSecret;
}

export function getRefreshSecret() {
  const refreshSecret = process.env.REFRESH_SECRET;
  if (!refreshSecret) {
    throw new CredentialsMissingErr("REFRESH_SECRET is not provided");
  }
  return refreshSecret;
}

export function signAccess(payload: AccessPayloadType) {
  const accessSecret = getAccessSecret();
  return jwt.sign(payload, accessSecret, { expiresIn: "6h" });
}

export function signRefresh(payload: RefreshPayloadType) {
  const refreshSecret = getRefreshSecret();
  return {
    token: jwt.sign(payload, refreshSecret, { expiresIn: "3d" }),
    maxAge: daysInMilliSeconds(3),
    expires: addDaysFromToday(3),
  };
}

// export function authUserInfo(res: Response): AccessPayloadType {
//   const result = authUserInfoZodSchema.safeParse(res.locals);
//   if (!result.success) {
//     throw new Error("Couldn't get cuurent user-info from response-locals");
//   }
//   return result.data;
// }

const failedAuth: UnAuthContext = { auth: false };

export function validateAccess(bearer: string | undefined): AppContext {
  const validBearer = bearerParser.safeParse(bearer);
  if (!validBearer.success) {
    return failedAuth;
  }
  const validJwtParser = jwtParser.safeParse(validBearer.data.split(" ")[1]);
  if (!validJwtParser.success) {
    return failedAuth;
  }
  const token = validJwtParser.data;
  try {
    const decoded = jwt.verify(token, getAccessSecret());
    const decodedParser = accessPayloadParser.safeParse(decoded);

    if (!decodedParser.success) {
      return failedAuth;
    }
    return { auth: true, ...decodedParser.data };
  } catch (error) {
    return failedAuth;
  }
}

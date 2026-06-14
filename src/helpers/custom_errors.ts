import { HTTP_STATUS } from "./constants.js";

/**
 * @description throw this error if important credentials are not in .env file
 *
 * @warning Don't ever... Catch this Error, let the App fail
 */
export class CredentialsMissingErr extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CredentialsMissingError";
  }
}

export class AlreadyExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistError";
  }
}

export class OperationFailedError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = HTTP_STATUS.badRequest) {
    super(message);
    this.name = "OperationFailedError";
    this.statusCode = statusCode;
  }
}

export class UnAuthorizedError extends Error {
  constructor(message: string = "UnAuthorized action") {
    super(message);
    this.name = "UnAuthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden action") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ResourceNotFoundError extends Error {
  public statusCode: number;
  constructor(
    message: string = "Requested resource not Found",
    statusCode: number = HTTP_STATUS.notFound,
  ) {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = statusCode;
  }
}

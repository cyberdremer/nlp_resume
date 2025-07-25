import { BaseError } from "./baseerror";

export class ValidationError extends BaseError {
  field?: string;
  constructor(field: string = "") {
    super(field, 400);
  }
}

export class BadRequest extends BaseError {
  constructor(message: string = "") {
    super(message, 400);
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor(resource: string = "Resource") {
    super(`${resource}: was not found!`, 404);
  }
}

export class UnsupportedFileType extends BaseError {
  receivedFileType?: string;
  constructor(receivedFileType: string) {
    super(`${receivedFileType} is an invalid file type!`, 400);
    this.receivedFileType = receivedFileType;
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

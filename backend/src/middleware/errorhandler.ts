import {
  Request,
  Errback,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

import { error } from "console";
import { BaseError } from "../errors/baseerror";
import { UnsupportedFileType, ValidationError } from "../errors/specificerrors";

interface ErrorResponse {
  error: {
    message: string;
    status: number;
    receivedFileType?: string;
    field?: string;
  };
}

const genericErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const errorResponse: ErrorResponse = {
    error: {
      message: "Internal Server Error",
      status: 500,
    },
  };

  if (err instanceof BaseError) {
    errorResponse.error.status = err.status;
    errorResponse.error.message = err.message;

    if ("receivedFileType" in err) {
      errorResponse.error.receivedFileType = (
        err as UnsupportedFileType
      ).receivedFileType;
    }

    if ("field" in err) {
      errorResponse.error.field = (err as ValidationError).field;
    }
  } else if (err instanceof Error) {
    errorResponse.error.message = err.message;
  }

  res.status(errorResponse.error.status).json(errorResponse);
};

export default genericErrorHandler;

import { Request, Errback, Response, NextFunction } from "express";
import GenericError from "../errors/errorgeneric";
import { error } from "console";

interface ErrorResponse {
  error: {
    message: string;
    status: number;
  };
}

const genericErrorHandler = (
  err: GenericError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  const status: number = err.status || 500;
  const message: string = err.message || "Internal Server Error";

  const errorResponse: ErrorResponse = {
    error: {
      status,
      message,
    },
  };

  res.status(status).json(errorResponse);
};



export default genericErrorHandler

import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/specificerrors";
const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    next(new UnauthorizedError("You are not allowed to view this resource"));
  }
};


export default isAuthorized
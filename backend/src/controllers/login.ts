import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import passport from "../config/passport";
import { loginValidator } from "../validators/validators";
import { validationResult } from "express-validator";
import { ResourceNotFoundError, ValidationError } from "../errors/specificerrors";
import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { SuccessfullServerResponse } from "../interfaces/successresponse";

interface UserInfo {
  email: string;
  fullname: string;
}

const loginController: RequestHandler[] = [
  loginValidator,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    passport.authenticate(
      "local",
      { session: true },
      (err: Error, user: User) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new ResourceNotFoundError("Invalid Credentials"));
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          const userInfo: UserInfo = {
            email: user.email,
            fullname: user.fullname,
          };

          const success: SuccessfullServerResponse<UserInfo> = {
            data: {
              message: "You have succesfully logged in!",
              status: 200,
              object: userInfo,
            },
          };

          res.status(200).json(success);
        });
      }
    )(req, res, next);
  }),
];


export default loginController

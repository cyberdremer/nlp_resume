import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";
import { validationResult } from "express-validator";
import { signUpValidator } from "../validators/validators";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import GenericError from "../errors/errorgeneric";
import {

  SuccessfullServerReponse,
} from "../interfaces/successresponse";

const signUpController = [
  signUpValidator,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new GenericError(errors.array()[0].msg, 400);
    }

    const { firstname, lastname, email, password } = req.body;

    const passwordhash = await bcrypt.hash(password, 16);

    const user = await prisma.user.create({
      data: {
        fullname: firstname + " " + lastname,
        email: email,
        passwordhash: passwordhash,
      },
    });

    const response: SuccessfullServerReponse<null> = {
      data: {
        status: 201,
        message: `${email} has been succesfully registered!`,
        object: null,
      },
    };

    res.status(response.data.status).json(response.data);
  }),
];

export default signUpController;

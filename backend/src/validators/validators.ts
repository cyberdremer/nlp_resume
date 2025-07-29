import { body, ValidationChain } from "express-validator";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { Request } from "express-validator/lib/base";
import { RequestHandler } from "express";
import { User } from "@prisma/client";
import { verifyDocument } from "../config/openai";
import { ValidationError } from "../errors/specificerrors";

const emptyMessage: string = "field cannot be empty!";

const signUpValidator: any = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username: ${emptyMessage}`)
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });

      if (user) {
        throw new Error("Username is already in use!");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email :${emptyMessage}`)
    .isEmail()
    .withMessage(`Email: must be an email!`)
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          email: value,
        },
      });

      if (user) {
        throw new Error("Email is already in use!");
      }
    }),

  body("lastname").notEmpty().withMessage(`Last Name: ${emptyMessage}`),

  body("firstname").notEmpty().withMessage(`First name: ${emptyMessage}`),

  body("password")
    .notEmpty()
    .withMessage(`Password: ${emptyMessage}`)
    .isLength({ min: 8 })
    .withMessage(`Password: must be at least 8 characters long`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage(
      "Password: must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!"
    ),
  ,
  body("confirmpassword")
    .trim()
    .notEmpty()
    .withMessage(`Password: ${emptyMessage}`)
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(
      `Confirm Password: Password confirmation must match the set password!`
    ),
];

const loginValidator: any = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email: ${emptyMessage}`)
    .isEmail()
    .withMessage(`Email: is not a valid email!`)
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });

      if (!user) {
        throw new Error(`Invalid Credentials `);
      }
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password: ${emptyMessage}`)
    .custom(async (value: string, { req }: { req: Request }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        throw new Error("Invalid Credentials");
      }

      const passwordMatch = await bcrypt.compare(
        value,
        user.passwordhash as string
      );
      if (!passwordMatch) {
        throw new Error("Invalid Credentials");
      }
    }),
];

const jobDescriptionValidator: any = [
  body("jobdescription")
    .trim()
    .notEmpty()
    .withMessage(`Job Description: ${emptyMessage}`)
    .custom(async (value) => {
      const isJobDescription = await verifyDocument(value);
      if (!isJobDescription) {
        throw new ValidationError();
      }
    })
    .withMessage(`Job Description: must be a valid job description`),
];

export { signUpValidator, loginValidator, jobDescriptionValidator };

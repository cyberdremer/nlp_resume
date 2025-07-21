import { body } from "express-validator";
import prisma from "../config/prisma";

const emptyMessage: string = "field cannot be empty!";

const signUpValidator = [
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

export { signUpValidator };

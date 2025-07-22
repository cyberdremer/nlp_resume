import { IStrategyOptions, Strategy} from "passport-local";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import "dotenv/config";


import { User } from "../generated/prisma";

const options = {
  usernameField: "email",
};

const strategyImplementation = async (
  email: string,
  password: string,
  done: any
) => {
  try {
    const user: User | null = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    let passwordHashToMatch: string;

    if (!user) {
      passwordHashToMatch = process.env.FAKE_HASH as string;
    } else {
      passwordHashToMatch = user.passwordhash as string;
    }

    const match = await bcrypt.compare(password, passwordHashToMatch);
    if (!user || !match) {
      done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
};


export const localStrategy = new Strategy(options, strategyImplementation);


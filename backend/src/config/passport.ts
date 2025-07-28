import passport, { DoneCallback } from "passport";
import { localStrategy } from "../strategies/local";
import { User } from "../generated/prisma";
import { userInfo } from "os";
import prisma from "./prisma";

passport.use(localStrategy);

passport.serializeUser((user: any, done: DoneCallback) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: DoneCallback) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        username: true
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;

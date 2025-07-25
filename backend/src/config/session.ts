import prisma from "./prisma";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import "dotenv/config"
import { RequestHandler } from "express";


const sessionConfig: RequestHandler = session({
    secret: process.env.SESSION_SECRET ?? "",
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test" ? false : true,
        sameSite: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test" ? "lax" : "none",
        httpOnly: process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test" ? false : true,
    },

    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        logger: console
    })
})


export default sessionConfig




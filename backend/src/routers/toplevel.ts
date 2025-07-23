import { Router } from "express";
import signUpRouter from "./signup";
import loginRouter from "./login";
const toplevelRouter = Router()

toplevelRouter.use("/signup", signUpRouter)
toplevelRouter.use("/login", loginRouter)


export default toplevelRouter;
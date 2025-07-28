import { Router } from "express";
import signUpRouter from "./signup";
import loginRouter from "./login";
import resumeRouter from "./resume";
const toplevelRouter = Router()

toplevelRouter.use("/signup", signUpRouter)
toplevelRouter.use("/login", loginRouter)
toplevelRouter.use("/resume", resumeRouter)


export default toplevelRouter;
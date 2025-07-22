import { Router } from "express";
import signUpRouter from "./signup";
const toplevelRouter = Router()

toplevelRouter.use("/signup", signUpRouter)


export default toplevelRouter;
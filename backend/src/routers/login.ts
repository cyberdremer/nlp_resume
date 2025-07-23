import { Router } from "express";
import loginController from "../controllers/login";
const loginRouter = Router()
loginRouter.post("/", loginController)

export default loginRouter
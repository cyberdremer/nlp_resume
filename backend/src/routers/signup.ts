import { Router } from "express";
import signUpController from "../controllers/signup";
import { signUpValidator } from "../validators/validators";
const signUpRouter = Router()

signUpRouter.post("/",  signUpController);


export default signUpRouter
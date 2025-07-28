import { Router } from "express";
import { resumeScoreController } from "../controllers/scoring";

const scoreRouter = Router()

scoreRouter.get(":id/score/:resumeId", resumeScoreController)

export default scoreRouter
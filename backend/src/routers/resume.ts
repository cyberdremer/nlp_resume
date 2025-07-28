import { Router } from "express";
import {
  updateResumeController,
  uploadResumeController,
  deleteResumeController,
  downloadResumeController,
  fetchAllResumeControllers,
  fetchOneResume,
} from "../controllers/resume";
const resumeRouter = Router();

resumeRouter.get("/",fetchAllResumeControllers);
resumeRouter.get("/:id", fetchOneResume)
resumeRouter.post("/upload", uploadResumeController)
resumeRouter.delete("/:id", deleteResumeController)
resumeRouter.get("/download/:id", downloadResumeController)
resumeRouter.put("/:id", updateResumeController)


export default resumeRouter

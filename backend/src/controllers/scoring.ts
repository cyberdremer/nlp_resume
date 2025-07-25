import { Response, Request, NextFunction, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import isAuthorized from "../middleware/authorized";
import PdfParse from "pdf-parse";

const resumeEmbeddingController: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userid = req.user.id;
  }),
];

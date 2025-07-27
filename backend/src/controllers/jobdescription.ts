import { NextFunction, RequestHandler, Request, Response } from "express";
import prisma from "../config/prisma";
import asyncHandler from "express-async-handler";
import isAuthorized from "../middleware/authorized";

import { ValidationError } from "../errors/specificerrors";
import { Result, validationResult } from "express-validator";
import { generateEmbedding } from "../config/openai";
import { writeEmbeddingToTable } from "../utility/rawsql/rawstatements";
import { SuccessfullServerResponse } from "../interfaces/successresponse";

const uploadJobDescription: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors: Result = validationResult(req);
    const { jobdescription, title } = req.body;
    const { id } = req.user;

    if (!errors.isEmpty()) {
      throw new ValidationError(errors.array()[0].msg);
    }

    const jobDescriptionRecord = await prisma.jobDescription.create({
      data: {
        title,
        content: jobdescription,
        created: new Date(),
        userId: id,
      },
    });

    const embedding = await generateEmbedding(jobdescription)
    writeEmbeddingToTable("JobDescription", jobDescriptionRecord.id, embedding)


    const successResponse: SuccessfullServerResponse = {
      data: {
        message:  "Job Description succesfully uploaded",
        status: 200,
        object: null
      }
    }


    res.status(successResponse.data.status).json(successResponse)
  }),
];

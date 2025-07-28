import { Response, Request, NextFunction, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import isAuthorized from "../middleware/authorized";
import PdfParse from "pdf-parse";
import {generateEmbedding} from "../config/openai";
import prisma from "../config/prisma";
import {
  computeCosineSimilarity,
  writeEmbeddingToTable,
} from "../utility/rawsql/rawstatements";
import { computeSimilarityRating } from "../utility/similarityscore";
import { SuccessfullServerResponse } from "../interfaces/successresponse";

const resumeScoreController: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { resumeId } = req.params;
    const userid = req.user.id;
    const { jobDescription, title } = req.body;
    const jobDescriptionEmbeddings = await generateEmbedding(jobDescription);

    const resumeRecord = await prisma.resume.findFirstOrThrow({
      where: {
        userid: userid,
        id: Number(resumeId),
      },
    });

    const jobDescriptionRecord = await prisma.jobDescription.create({
      data: {
        content: jobDescription,
        created: new Date(),
        userId: userid,
        title: title,
      },
    });

    const affectedRowsJD = await writeEmbeddingToTable(
      "JobDescription",
      jobDescriptionRecord.id,
      jobDescriptionEmbeddings
    );
    const similarity_score = await computeCosineSimilarity(
      jobDescriptionRecord.id,
      resumeRecord.id
    );
    const ratingObject = computeSimilarityRating(
      similarity_score.similarityScore
    );

    const feedBackRecord = await prisma.feedback.create({
      data: {
        date: new Date(),
        name: `${resumeRecord.name + jobDescriptionRecord.title}`,
        text: ratingObject.match,
        score: ratingObject.rating,
        resumeId: Number(resumeId),
        jobId: jobDescriptionRecord.id,
      },
    });

    const successResponse: SuccessfullServerResponse<{}> = {
      data: {
        message: "Your resume has been scored!",
        status: 201,
        object: ratingObject,
      },
    };

    res.status(successResponse.data.status).json(successResponse);
  }),
];



export {resumeScoreController}



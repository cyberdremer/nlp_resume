import { RequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import isAuthorized from "../middleware/authorized";
import multerMiddleware from "../middleware/upload";
import {
  deleteFileFromCloudinary,
  replaceFileFromCloudinary,
  uploadBufferToCloudinary,
} from "../cloud/uploading";
import { ValidationError } from "../errors/specificerrors";
import prisma from "../config/prisma";
import { SuccessfullServerResponse } from "../interfaces/successresponse";
import { Resume } from "@prisma/client";
import { ResumeInfo } from "../interfaces/resume";
import { extractTextFromPDF } from "../utility/pdfparsing";
import generateEmbedding from "../config/openai";
import pgvector from "pgvector";
import { writeEmbeddingToTable } from "../utility/rawsql/rawstatements";
import { resolve } from "path";
import { BaseError } from "../errors/baseerror";
import { Readable } from "stream";

const uploadResumeController: RequestHandler[] = [
  isAuthorized,
  multerMiddleware.single("resume"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new ValidationError("File is missing");
    }
    const { id, email } = req.user;
    const { buffer, mimetype, size } = req.file;
    const rawtext = await extractTextFromPDF(buffer);

    if (rawtext.trim().length < 100) {
      throw new ValidationError("Resume content is too short or empty");
    }

    const result = await uploadBufferToCloudinary(email, buffer);

    const { original_filename, secure_url, public_id } = result;
    let embedding = await generateEmbedding(rawtext);
    embedding = pgvector.toSql(embedding);

    const createdResume = await prisma.resume.create({
      data: {
        userid: id,
        name: original_filename,
        size: size,
        mimetype: mimetype,
        cloudlink: secure_url,
        cloudpublicid: public_id,
        rawtext: rawtext,
      },
    });

    const affectedRows = writeEmbeddingToTable(
      "Resume",
      createdResume.id,
      embedding
    );

    const response: SuccessfullServerResponse = {
      data: {
        message: `${original_filename} has been uploaded!`,
        status: 200,
        object: null,
      },
    };

    res.status(response.data.status).json(response);
  }),
];

const deleteResumeController: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fileId } = req.params;
    const { id } = req.user;
    await deleteFileFromCloudinary(fileId);

    const deletedFile = await prisma.resume.delete({
      where: {
        id: Number(fileId),
        userid: id,
      },
    });

    const successResponse: SuccessfullServerResponse = {
      data: {
        message: `${deletedFile.name} has been succesfully deleted`,
        status: 200,
        object: null,
      },
    };

    res.status(successResponse.data.status).json(successResponse);
  }),
];

const fetchAllResumeControllers: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user.id;

    const fetchedResumes = await prisma.resume.findMany({
      where: {
        userid: userid,
      },
      select: {
        name: true,
        cloudlink: true,
        id: true,
      },
    });

    const resumes: ResumeInfo[] = fetchedResumes.map((fetchedResume) => {
      return <ResumeInfo>{
        name: fetchedResume.name,
        id: fetchedResume.id,
        link: fetchedResume.cloudlink,
      };
    });

    const successResponse: SuccessfullServerResponse<ResumeInfo[]> = {
      data: {
        message: "Resumes have been succefully fetched",
        status: 200,
        object: resumes,
      },
    };

    res.status(successResponse.data.status).json(successResponse);
  }),
];

const updateResumeController: RequestHandler[] = [
  isAuthorized,
  multerMiddleware.single("resume"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new ValidationError("File is missing");
    }
    const { id } = req.params;
    const userId = req.user;
    const { buffer } = req.file;

    const response = await replaceFileFromCloudinary(id, buffer);
    const { cloudid, cloudlink, original_filename } = response;

    const updatedFile = await prisma.resume.update({
      where: {
        userid: userId,
        id: Number(id),
      },
      data: {
        date: new Date(),
        name: original_filename,
        cloudpublicid: cloudid,
        cloudlink: cloudlink,
      },
    });

    const successfullResponse: SuccessfullServerResponse = {
      data: {
        message: `${original_filename} has been updated!`,
        status: 200,
        object: null,
      },
    };

    res.status(successfullResponse.data.status).json(successfullResponse);
  }),
];

const downloadResumeController: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { resumeId } = req.params;
    const userid = req.user.id;
    const resumeRecord = await prisma.resume.findFirstOrThrow({
      where: {
        id: Number(resumeId),
        userid: userid,
      },
    });

    const cloudRes = await fetch(resumeRecord.cloudlink);
    if (!cloudRes.ok || !cloudRes.body) {
      throw new BaseError("Failed to fetch from cloudinary", 502);
    }

    res.set({
      "Content-Type":
        cloudRes.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename=${resumeRecord.name}`,
    });

    Readable.fromWeb(cloudRes.body).pipe(res);
  }),
];

const fetchOneResume: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userid = req.user.id;

    const resumeRecord = await prisma.resume.findFirstOrThrow({
      where: {
        id: Number(id),
        userid: userid,
      },
      select: {
        name: true,
        id: true,
        cloudlink: true,
      },
    });

    const resumeToSend: ResumeInfo = {
      name: resumeRecord.name,
      link: resumeRecord.cloudlink,
      id: resumeRecord.id,
    };

    const successfullResponse: SuccessfullServerResponse<ResumeInfo> = {
      data: {
        object: resumeToSend,
        status: 200,
        message: `${resumeRecord.name} has been found!`,
      },
    };

    res.status(successfullResponse.data.status).json(successfullResponse.data);
  }),
];

export {
  updateResumeController,
  deleteResumeController,
  uploadResumeController,
  downloadResumeController,
  fetchOneResume,
  fetchAllResumeControllers,
};

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



const uploadResumeController: RequestHandler[] = [
  isAuthorized,
  multerMiddleware.single("resume"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new ValidationError("File is missing");
    }
    const { id, email } = req.user;
    const { buffer, mimetype, size } = req.file;

    const result = await uploadBufferToCloudinary(email, buffer);
    const rawtext = await extractTextFromPDF(buffer);
    const { original_filename, secure_url, public_id } = result;

    await prisma.resume.create({
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
        cloudpublicid: true,
      },
    });

    const resumes: ResumeInfo[] = fetchedResumes.map((fetchedResume) => {
      return <ResumeInfo>{
        name: fetchedResume.name,
        id: fetchedResume.cloudpublicid,
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

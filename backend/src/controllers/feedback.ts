import { RequestHandler, Response, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import isAuthorized from "../middleware/authorized";
import prisma from "../config/prisma";
import { SuccessfullServerResponse } from "../interfaces/successresponse";
import { Feedback } from "@prisma/client";

const deleteFeedback: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userid = req.user;
    const feedbackToDelete = await prisma.feedback.delete({
      where: {
        id: Number(id),
        userId: userid,
      },
    });

    const succesfullResponse: SuccessfullServerResponse = {
      data: {
        message: "Feedback has been deleted",
        status: 200,
        object: null,
      },
    };

    res
      .status(succesfullResponse.data.status)
      .json(succesfullResponse.data.message);
  }),
];

const getFeedback: RequestHandler[] = [
  isAuthorized,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userid = req.user;

    const feedbackFound: Feedback = await prisma.feedback.findFirstOrThrow({
      where: {
        id: Number(id),
        userId: userid,
      },
    });

    const serverResponse: SuccessfullServerResponse<Feedback> = {
      data: {
        message: "Feedback found",
        status: 201,
        object: feedbackFound,
      },
    };

    res.status(serverResponse.data.status).json(serverResponse);
  }),
];


export {deleteFeedback, getFeedback}
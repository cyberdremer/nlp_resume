import { NextFunction, Request, Response } from "express";
const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  const { statusCode } = res;

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(
      `[Duration in ms]: ${durationMs}\n[Method]: ${method}\n[Original Url]: ${originalUrl}\n[Status Code]: ${statusCode}`
    );
  });
  next();
};

export default logger;

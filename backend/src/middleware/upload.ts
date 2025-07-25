import multer from "multer";
import { Request} from "express";
import { FileFilterCallback } from "multer";
import { UnsupportedFileType, ValidationError } from "../errors/specificerrors";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const acceptedTypes: string[] = [
    "application/pdf",
    "application/msword",
    "text/plain",
  ];

  if (!req.file) {
    cb(new ValidationError(`File: you cannot upload an empty field!`));
  }
  if (!acceptedTypes.includes(file.mimetype)) {
    cb(new UnsupportedFileType(file.mimetype));
  }
  cb(null, true);
};

const limits = {
  fileSize: 10 * 1024 * 1024,
};

const multerMiddleware = multer({
  storage,
  limits,
  fileFilter,
});

export default multerMiddleware;

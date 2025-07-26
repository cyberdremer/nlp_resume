import {
  UploadStream,
  UploadResponseCallback,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import cloudUploader from "../config/cloudinary";
import fs from "fs";

import { BadRequest, ResourceNotFoundError } from "../errors/specificerrors";
import { Readable } from "stream";

const uploadBufferToCloudinary = async (
  username: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  const uploadResult: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudUploader.uploader
        .upload_stream(
          {
            folder: `nlp_resume_app/${username}`,
            type: "auto",
          },
          (error, result) => {
            if (error) {
              return reject(new BadRequest(error.message));
            }
            if (!result) {
              return reject(new BadRequest("Upload failed with no result!"));
            }
            resolve(result);
          }
        )
        .end(buffer);
    }
  );
  return uploadResult;
};

const deleteFileFromCloudinary = async (fileId: string) => {
  try {
    const deletedFile = await cloudUploader.uploader.destroy(fileId);
    return deletedFile;
  } catch (error) {
    throw new ResourceNotFoundError(
      `File with file id: ${fileId}, was not found!`
    );
  }
};

const replaceFileFromCloudinary = async (
  fileId: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  const uploadResult: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudUploader.uploader
        .upload_stream({ public_id: fileId }, (err, result) => {
          if (err) {
            return reject(new BadRequest(err.message));
          }
          if (!result) {
            return reject(new BadRequest("Error with the file stream"));
          }

          resolve(result);
        })
        .end(buffer);
    }
  );

  return uploadResult;
};



export {
  uploadBufferToCloudinary,
  deleteFileFromCloudinary,
  replaceFileFromCloudinary,
};

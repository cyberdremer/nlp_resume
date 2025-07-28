import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  secure: true,
});

const cloudUploader = cloudinary;

export default cloudUploader;

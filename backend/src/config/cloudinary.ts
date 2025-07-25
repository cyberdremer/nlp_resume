import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API,
});


const cloudUploader = cloudinary


export default cloudUploader









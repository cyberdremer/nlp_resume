import PdfParse from "pdf-parse";
import { buffer } from "stream/consumers";

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await PdfParse(buffer);
    return data.text.trim();
  } catch (err) {
    throw new Error("Could not parse PDF")
  }
};

import OpenAI from "openai";
import { jobDescriptionPrompt } from "../prompts/jobdescription";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const embedding = await client.embeddings.create({
      input: text,
      model: "text-embedding-3-small",
      encoding_format: "float",
    });

    return embedding.data[0].embedding;
  } catch (err) {
    throw err;
  }
};

const verifyDocument = async (documentText: string): Promise<boolean> => {
  const response = await client.responses.create({
    model: "o4-mini-deep-research-2025-06-26",
    input: jobDescriptionPrompt(documentText),
  });

  const jdObject = JSON.parse(response.output_text);
  return jdObject.isJob;
};

export {generateEmbedding, verifyDocument};

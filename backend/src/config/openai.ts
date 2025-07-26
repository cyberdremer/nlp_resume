import OpenAI from "openai";

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





export default generateEmbedding

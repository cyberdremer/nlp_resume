import prisma from "../../config/prisma";
import { BaseError } from "../../errors/baseerror";

export const writeEmbeddingToTable = async (
  tableName: string,
  rowId: number,
  embedding: Number[]
): Promise<unknown> => {
  try {
    
    const tableNames: [{ table_name: string }] =
      await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'postgres'`;

    const sql = `UPDATE "${tableName}" SET embedding = '${embedding}' WHERE id = ${rowId}`;
    // if (!tableNames.find((name) => name.table_name === tableName)) {
    //   throw new BaseError("Given invalid table name", 500);
    // }
    // INSERT INTO (${tableName}) VALUES (${embedding}::vector) WHERE id=(${rowId})
    const result = await prisma.$executeRawUnsafe(sql);
    return result;
  } catch (err) {
    throw err;
  }
};

export const computeCosineSimilarity = async (
  jobDescriptionId: number,
  resumeId: number
) => {
  try {
    const [result] = await prisma.$queryRawUnsafe<
      { similarityScore: number }[]
    >(
      `SELECT 1 - (r.embedding <=> j.embedding) AS similarity_score FROM "Resume" r JOIN "JobDescription" j on j.id = $1 WHERE r.id = $2`,
      [jobDescriptionId, resumeId]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

/*
  Warnings:

  - You are about to drop the column `data` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `score` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "data",
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

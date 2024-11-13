/*
  Warnings:

  - You are about to drop the column `adminId` on the `Space` table. All the data in the column will be lost.
  - Added the required column `createrId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_adminId_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "adminId",
ADD COLUMN     "createrId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_createrId_fkey" FOREIGN KEY ("createrId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

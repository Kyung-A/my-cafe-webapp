/*
  Warnings:

  - You are about to drop the `ReviewImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN "reviewImages" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReviewImages";
PRAGMA foreign_keys=on;

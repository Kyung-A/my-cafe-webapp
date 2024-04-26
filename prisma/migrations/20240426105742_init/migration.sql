/*
  Warnings:

  - Added the required column `x` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cafeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starRating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "good" TEXT NOT NULL,
    "notGood" TEXT NOT NULL,
    "tags" TEXT,
    "recommend" TEXT NOT NULL,
    "x" TEXT NOT NULL,
    "y" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("cafeId", "createdAt", "description", "good", "id", "name", "notGood", "recommend", "starRating", "tags", "updatedAt", "userId", "visited") SELECT "cafeId", "createdAt", "description", "good", "id", "name", "notGood", "recommend", "starRating", "tags", "updatedAt", "userId", "visited" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_cafeId_key" ON "Review"("cafeId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - You are about to drop the column `likes` on the `Review` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Likes" (
    "reviewId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    CONSTRAINT "Likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cafeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reviewImages" TEXT,
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
INSERT INTO "new_Review" ("cafeId", "createdAt", "description", "good", "id", "name", "notGood", "recommend", "reviewImages", "starRating", "tags", "updatedAt", "userId", "visited", "x", "y") SELECT "cafeId", "createdAt", "description", "good", "id", "name", "notGood", "recommend", "reviewImages", "starRating", "tags", "updatedAt", "userId", "visited", "x", "y" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_id_key" ON "Review"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

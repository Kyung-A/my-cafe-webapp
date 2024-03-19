/*
  Warnings:

  - A unique constraint covering the columns `[reviewId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cafeId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_reviewId_key" ON "Bookmark"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_cafeId_key" ON "Review"("cafeId");

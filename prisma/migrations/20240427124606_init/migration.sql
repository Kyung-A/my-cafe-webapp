/*
  Warnings:

  - You are about to drop the `Follower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Following` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Follower";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Following";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    PRIMARY KEY ("followerId", "followingId"),
    CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

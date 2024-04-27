import { db } from "./db";
import { IFollow } from "~/shared/types";

export async function getFollowings(id: string) {
  const followingList = await db.user.findUnique({
    where: { id },
    select: {
      id: false,
      email: false,
      name: false,
      passwordHash: false,
      createdAt: false,
      updatedAt: false,
      review: false,
      followers: false,
      following: true,
    },
  });

  const result = followingList?.following.map((v) => v.followingId);
  return result;
}

export async function createFollow(data: IFollow) {
  try {
    const result = await db.follows.create({
      data,
    });

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

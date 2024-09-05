import { db } from "./db";
import { ILikedProps, IReview } from "~/entities/review/types";

export async function createReview(data: IReview) {
  try {
    const result = await db.review.create({ data });
    return result.id;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateReview(data: IReview) {
  try {
    const result = await db.review.update({
      where: { id: data.id },
      data,
    });
    return result.id;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getReviewList(userId: string) {
  if (!userId) return null;
  try {
    const result = await db.review.findMany({
      where: { authorId: userId },
    });

    if (result?.length === 0) return null;
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getReview(id: string) {
  try {
    const result = await db.review.findUnique({
      where: { id },
      include: {
        likedBy: {
          select: {
            id: true,
          },
        },
      },
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createReviewLike(data: ILikedProps) {
  try {
    const result = await db.review.update({
      where: { id: data.reviewId },
      data: {
        likedBy: {
          connect: { id: data.userId },
        },
      },
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function removeReviewLike(data: ILikedProps) {
  try {
    const result = await db.review.update({
      where: { id: data.reviewId },
      data: {
        likedBy: {
          disconnect: { id: data.userId },
        },
      },
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

import { IReview } from "~/shared/types";
import { db } from "./db";

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
      where: { userId: userId },
      take: 45,
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
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

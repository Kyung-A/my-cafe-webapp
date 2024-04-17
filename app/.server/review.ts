import { IReview } from "~/shared/types";
import { db } from "./db";
import { getToken } from "./storage";

export async function createReview(data: IReview) {
  try {
    const result = await db.review.create({ data });
    return result.id;
  } catch (err) {
    console.error(err);
    return err;
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
    return err;
  }
}

export async function getReviewList(request: Request) {
  try {
    const session = await getToken(request);
    const userId = session.get("userId");

    if (userId) return null;
    const result = await db.user.findUnique({
      where: { id: userId },
      include: { review: true },
    });

    if (result?.review.length === 0) return null;
    return result?.review;
  } catch (err) {
    console.error(err);
    return err;
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
    return err;
  }
}

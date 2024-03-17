import { IReview } from "~/shared/types";
import { db } from "./db";
import { request } from "node_modules/axios/index.cjs";
import { getToken } from "./storage";

export async function postReview(data: IReview) {
  try {
    await db.review.create({ data });
  } catch (err) {
    console.error(err);
  }
}

export async function getReviewList(request: Request) {
  try {
    const session = await getToken(request);
    const userId = session.get("userId");

    if (userId) {
      const result = await db.user.findUnique({
        where: { id: userId },
        include: { review: true },
      });
      return result?.review;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
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
  }
}

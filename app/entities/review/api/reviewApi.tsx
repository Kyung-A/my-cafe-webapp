import { getReviewList } from "~/.server/review";
import { IReview } from "../types";

export async function reviewApi(id: string): Promise<IReview[] | null> {
  let result = null;
  try {
    result = await getReviewList(id);
    return result;
  } catch (e) {
    console.error(e);
  }

  return result;
}

import { createReviewLike, removeReviewLike } from "~/.server/review";
import { ILikedProps } from "../types";

export async function reivewLiked(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(
    Array.from(formData.entries())
  ) as unknown as ILikedProps;

  const { isLiked, ...otherData } = data;

  if (isLiked === "true") {
    await removeReviewLike(otherData);
  } else {
    await createReviewLike(otherData);
  }
}

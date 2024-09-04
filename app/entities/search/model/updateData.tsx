import { IReview } from "~/shared/types";
import { ISearchData } from "../types";

export function updateData(
  cafeData: { current: ISearchData[] },
  newReview: IReview
) {
  cafeData.current.forEach((v: ISearchData, i: number) => {
    if (v.id === newReview.cafeId) {
      cafeData.current[i] = {
        ...v,
        reviewId: newReview.id,
        review: newReview.description,
        visited: newReview.visited,
      };
    }
  });
}

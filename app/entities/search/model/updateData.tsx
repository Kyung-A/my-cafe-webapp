import { IReview } from "~/shared/types";
import { ISearchData } from "../types";

export function updateData(cafeData: ISearchData[], newReview: IReview) {
  cafeData.forEach((v: ISearchData, i: number) => {
    if (v.id === newReview.cafeId) {
      cafeData[i] = {
        ...v,
        reviewId: newReview.id,
        review: newReview.description,
        visited: newReview.visited,
      };
    }
  });
}

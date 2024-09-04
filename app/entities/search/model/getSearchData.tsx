import { IReview } from "~/entities/review/types";
import {
  IDataPagination,
  IDataResponse,
  IMapData,
  ISearchData,
} from "../types";

function noReviewsData(acc: IDataResponse, cur: ISearchData, index: number) {
  return (acc.data[index] = {
    ...cur,
    visited: false,
  });
}

function reviewsData(
  reviews: IReview[],
  acc: IDataResponse,
  cur: ISearchData,
  index: number
) {
  for (const review of reviews) {
    const { id, cafeId, description, visited } = review;

    if (cur.id === cafeId) {
      acc.data[index] = {
        ...cur,
        reviewId: id,
        review: description,
        visited: visited,
      };
      break;
    } else {
      acc.data[index] = {
        ...cur,
        visited: false,
      };
    }
  }
}

function visitedData(reviews: IReview[], acc: IDataResponse, cur: ISearchData) {
  reviews.forEach((review) => {
    const { id, cafeId, description, visited } = review;
    if (cur.id === cafeId) {
      if (visited) {
        return acc.data.push({
          ...cur,
          reviewId: id,
          review: description,
          visited: visited,
        });
      }
    }
  });
}

export function getCafeData(
  type: string | undefined,
  reviews: IReview[] | null,
  mapData: IMapData | undefined,
  searchKeyword: string | undefined
): Promise<IDataResponse> {
  return new Promise((resolve, reject) => {
    const { kakao } = window;
    if (!kakao || !mapData) return reject(new Error("kakao map error"));

    const ps = new kakao.maps.services.Places(mapData);
    if (type === "search") {
      ps.keywordSearch(
        searchKeyword,
        (data: ISearchData[], status: string, paging: IDataPagination) => {
          if (status !== kakao.maps.services.Status.OK)
            return reject(new Error("failed to fetch"));

          const result = data.reduce(
            (acc, cur, index) => {
              if (!reviews) {
                noReviewsData(acc, cur, index);
              } else {
                reviewsData(reviews, acc, cur, index);
              }

              acc.paging = paging;
              return acc;
            },
            { data: [] as ISearchData[], paging: {} as IDataPagination }
          );

          resolve(result);
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    } else {
      ps.categorySearch(
        "CE7",
        (data: ISearchData[], status: string, paging: IDataPagination) => {
          if (status !== kakao.maps.services.Status.OK)
            return reject(new Error("failed to fetch"));

          const result = data.reduce(
            (acc, cur, index) => {
              if (!reviews && type === "default") {
                noReviewsData(acc, cur, index);
              }

              if (reviews && type === "default") {
                reviewsData(reviews, acc, cur, index);
              }

              if (reviews && type === "visited") {
                visitedData(reviews, acc, cur);
              }

              acc.paging = paging;
              return acc;
            },
            { data: [] as ISearchData[], paging: {} as IDataPagination }
          );

          resolve(result);
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    }
  });
}

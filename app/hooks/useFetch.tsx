import { useLocation } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { useMap } from "~/shared/contexts/Map";
import {
  ICafePagination,
  ICafeResponse,
  ICoord,
  IMarker,
  IReview,
} from "~/shared/types";
import { markerOption } from "~/shared/utils/markerOption";

export function useFetch() {
  const { mapData, cafeData, setPagination, markers, setMarkers } = useMap();

  const addMarker = useCallback(
    (data: ICafeResponse[] | ICoord[] | null) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const markerArr: IMarker[] = [];

      data?.forEach((cafe) => {
        const position = new kakao.maps.LatLng(cafe.y, cafe.x);
        const markerImage = markerOption(kakao);
        const marker = new kakao.maps.Marker({
          map: mapData,
          position: position,
          image: markerImage,
        });
        markerArr.push(marker);
      });

      setMarkers(markerArr);
    },
    [mapData]
  );

  const fetchCafeData = useCallback(
    (type: string, reviewData: IReview[] | null) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const ps = new kakao.maps.services.Places(mapData);
      ps.categorySearch(
        "CE7",
        (data: ICafeResponse[], status: string, paging: ICafePagination) => {
          if (status !== kakao.maps.services.Status.OK) return;

          /* 카페 목록 */
          let result: ICafeResponse[] = [];

          if (type !== "notVisited") {
            result = data.reduce((acc: ICafeResponse[], cur, index) => {
              // 리뷰 X && 주변검색
              if (!reviewData && type === "default") {
                acc[index] = {
                  ...cur,
                  visited: false,
                };
              }

              // 리뷰 O
              if (reviewData) {
                // 주변검색
                if (type === "default") {
                  for (const review of reviewData) {
                    const { id, cafeId, description, visited } = review;

                    if (cur.id === cafeId) {
                      acc[index] = {
                        ...cur,
                        reviewId: id,
                        review: description,
                        visited: visited,
                      };
                      break;
                    } else {
                      // 리뷰 있/없 총 데이터 반환
                      acc[index] = {
                        ...cur,
                        visited: false,
                      };
                    }
                  }
                }

                // 방문 O
                if (type === "visited") {
                  reviewData.forEach((review) => {
                    const { id, cafeId, description, visited } = review;
                    if (cur.id === cafeId) {
                      if (visited) {
                        return acc.push({
                          ...cur,
                          reviewId: id,
                          review: description,
                          visited: visited,
                        });
                      }
                    }
                  });
                }
              }

              return acc;
            }, []);
          }

          if (type === "notVisited") {
            if (reviewData) {
              result = data.filter((v) => {
                return !reviewData.some(
                  (review) =>
                    review.cafeId === v.id && {
                      ...v,
                      visited: false,
                    }
                );
              });
            }
          }

          cafeData.current = [
            ...(cafeData.current as ICafeResponse[]),
            ...result,
          ];
          setPagination(paging);
          addMarker(cafeData.current);
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    },
    [mapData, markers]
  );

  const refetchCafeData = (newReview: IReview) => {
    cafeData.current?.forEach((v: ICafeResponse, i: number) => {
      if (v.id === newReview.cafeId) {
        cafeData.current![i] = {
          ...v,
          review: newReview.description,
          visited: newReview.visited,
        };
      }
    });
  };

  return { addMarker, fetchCafeData, refetchCafeData };
}

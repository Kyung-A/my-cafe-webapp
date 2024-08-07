import { useLocation, useNavigate } from "@remix-run/react";
import { useCallback } from "react";

import { useMap } from "~/shared/contexts/Map";
import {
  ICafePagination,
  ICafeResponse,
  ICoord,
  IMarker,
  IReview,
} from "~/shared/types";
import markerImg from "~/assets/marker.png";

export function useFetch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mapData, cafeData, setPagination, markers, setMarkers, clusterer } =
    useMap();

  const textWidth = (text: number) => {
    if (text > 12) return 200;
    if (text > 10 && text <= 12) return 160;
    if (text >= 7 && text <= 10) return 130;
    if (text > 5 && text < 8) return 80;
    if (text <= 5) return 60;
  };

  const addMarker = useCallback(
    (data: ICafeResponse[] | ICoord[] | null) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const markerArr: IMarker[] = [];

      data?.forEach((cafe) => {
        const position = new kakao.maps.LatLng(cafe.y, cafe.x);
        const imageSrc = markerImg;
        const imageSize = new kakao.maps.Size(
          textWidth(cafe.place_name?.length as number),
          50
        );
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        const marker = new kakao.maps.Marker({
          map: mapData,
          position: position,
          title: cafe.id,
          image: markerImage,
          zIndex: 30,
        });

        markerArr.push(marker);

        kakao.maps.event.addListener(marker, "click", function () {
          navigate(`/search/${cafe.id}`, {
            state: {
              x: cafe.x,
              y: cafe.y,
              ...(cafe.review && { review: cafe.review }),
              ...(cafe.reviewId && { reviewId: cafe.reviewId }),
            },
          });
        });
      });

      clusterer?.addMarkers(markerArr);
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

          cafeData.current = [
            ...(cafeData.current as ICafeResponse[]),
            ...result,
          ];

          setPagination(paging);
          if (location.pathname.includes("/directions")) return;
          if (!paging.hasNextPage) {
            addMarker(cafeData.current);
          }
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    },
    [mapData, markers, location]
  );

  const refetchCafeData = (newReview: IReview) => {
    cafeData.current?.forEach((v: ICafeResponse, i: number) => {
      if (v.id === newReview.cafeId) {
        cafeData.current![i] = {
          ...v,
          reviewId: newReview.id,
          review: newReview.description,
          visited: newReview.visited,
        };
      }
    });
  };

  return { addMarker, fetchCafeData, refetchCafeData };
}

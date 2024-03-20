import { useCallback } from "react";

import { useMap } from "~/shared/contexts/Map";
import { useFetch, useRemove } from ".";
import { ICafePagination, ICafeResponse, IReview } from "~/shared/types";

export function useKeyword() {
  const { mapData, cafeData, markers, setPagination } = useMap();
  const { removeData, removeMarker } = useRemove();
  const { addMarker } = useFetch();

  const searchKeyword = useCallback(
    (text: string, reviewData: IReview[]) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const ps = new kakao.maps.services.Places(mapData);

      if (cafeData.current && cafeData.current.length > 0) {
        removeMarker();
        removeData();
      }

      ps.keywordSearch(
        text,
        (data: ICafeResponse[], status: string, paging: ICafePagination) => {
          if (status !== kakao.maps.services.Status.OK) return;

          const result = data.reduce((acc: ICafeResponse[], cur, index) => {
            // 리뷰 X
            if (!reviewData) {
              acc[index] = {
                ...cur,
                visited: false,
              };
            } else {
              // 리뷰 O
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

            return acc;
          }, []);

          cafeData.current = [
            ...(cafeData.current as ICafeResponse[]),
            ...result,
          ];
          setPagination(paging);
          addMarker(cafeData.current);
        },
        { useMapBounds: true }
      );
    },
    [cafeData, mapData, markers.length]
  );

  return { searchKeyword };
}

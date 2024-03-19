/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
  useState,
  useCallback,
} from "react";
import { useGeoLocation } from "~/hooks";
import { GNB } from "../consts/gnb";
import { ICafePagination, ICafeResponse, IMenu, IReview } from "../types";

interface IMap {
  mapEl: MutableRefObject<any> | null;
  mapData: any;
  GNB: IMenu[];
  setGNB: React.Dispatch<React.SetStateAction<IMenu[]>>;
  cafeData: any;
  fetchCafeData: (type: string, data: any) => void;
  searchKeyword: (text: string, data: any) => void;
  handlePagination: () => void;
  removeData: () => void;
  removeMarker: () => void;
  refetchCafeData: (reivew: IReview) => void;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: {},
  GNB: [],
  setGNB: () => [],
  cafeData: [],
  fetchCafeData: () => null,
  searchKeyword: () => null,
  handlePagination: () => null,
  removeData: () => null,
  removeMarker: () => null,
  refetchCafeData: () => null,
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef(null);
  const cafeData = useRef<ICafeResponse[]>([]);
  const { curLocation } = useGeoLocation();

  const [mapData, setMapData] = useState();
  const [copyGNB, setCopyGNB] = useState<IMenu[]>(GNB);
  const [markers, setMarkers] = useState<{ [key: string]: any }[]>([]);
  const [pagination, setPagination] = useState<ICafePagination>();

  // 지도 마커 삭제
  const removeMarker = useCallback(() => {
    markers.forEach((v) => v.setMap(null));
    setMarkers([]);
  }, [markers]);

  // 카페 목록 삭제
  const removeData = () => {
    cafeData.current = [];
  };

  // 목록 다음 페이지
  const handlePagination = useCallback(() => {
    if (pagination?.hasNextPage) {
      removeMarker();
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  // 마커 추가
  const addMarker = useCallback(
    (data: ICafeResponse[] | null) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const markerArr: { [key: string]: any }[] = [];

      data?.forEach((cafe) => {
        const position = new kakao.maps.LatLng(cafe.y, cafe.x);

        const imageSrc = "https://t1.daumcdn.net/mapjsapi/images/2x/marker.png";
        const imageSize = new kakao.maps.Size(28, 40);
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
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

  // 키워드 검색
  const searchKeyword = useCallback(
    (text: string, reviewData: IReview[]) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const ps = new kakao.maps.services.Places(mapData);

      if (cafeData.current.length > 0 && markers.length > 0) {
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

          cafeData.current = [...cafeData.current, ...result];
          setPagination(paging);
          addMarker(cafeData.current);
        },
        { useMapBounds: true }
      );
    },
    [addMarker, mapData, markers, removeMarker]
  );

  // 후기 등록, 수정 시 목록 리패칭
  const refetchCafeData = (newReview: IReview) => {
    cafeData.current.forEach((v, i) => {
      if (v.id === newReview.cafeId) {
        cafeData.current[i] = {
          ...v,
          review: newReview.description,
          visited: newReview.visited,
          // booking: newReview.booking,
        };
      }
    });
  };

  // 카페 데이터와 유저 리뷰 데이터 맵핑
  const fetchCafeData = useCallback(
    (type: string, reviewData: IReview[]) => {
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

          cafeData.current = [...cafeData.current, ...result];
          setPagination(paging);

          if (markers.length === 0) {
            addMarker(cafeData.current);
          }
        },
        { useMapBounds: true, useMapCenter: true, radius: 1000 }
      );
    },
    [mapData, markers]
  );

  // 지도 초기화
  useEffect(() => {
    const { kakao } = window;
    if (!mapEl.current || !kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 6,
      };

      const map = new kakao.maps.Map(mapEl.current, options);
      setMapData(map);
    });
  }, [mapEl, curLocation]);

  return (
    <MapContext.Provider
      value={{
        mapEl,
        mapData,
        GNB: copyGNB,
        setGNB: setCopyGNB,
        cafeData: cafeData,
        fetchCafeData,
        searchKeyword,
        handlePagination,
        removeData,
        removeMarker,
        refetchCafeData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

import {
  IDataPagination,
  IDataResponse,
  IMapData,
  ISearchData,
} from "~/entities/search/types";

export function getKeywordSearchData(
  mapData: IMapData | undefined,
  searchKeyword: string | undefined
): Promise<IDataResponse> {
  return new Promise((resolve, reject) => {
    const { kakao } = window;
    if (!kakao || !mapData) return reject(new Error("kakao map error"));

    const ps = new kakao.maps.services.Places(mapData);
    ps.keywordSearch(
      searchKeyword,
      (data: ISearchData[], status: string, paging: IDataPagination) => {
        if (status !== kakao.maps.services.Status.OK)
          return reject(new Error("failed to fetch"));
        const result = data.reduce(
          (acc, cur, index) => {
            acc.data[index] = {
              ...cur,
              visited: false,
            };

            acc.paging = paging;
            return acc;
          },
          { data: [] as ISearchData[], paging: {} as IDataPagination }
        );

        resolve(result);
      },
      { useMapBounds: true, useMapCenter: true, radius: 1000 }
    );
  });
}

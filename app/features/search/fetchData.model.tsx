import { createMarker, getCafeData } from "~/entities/search";
import {
  IClusterer,
  IMapData,
  IMarker,
  ISearchData,
} from "~/entities/search/types";
import { IReview } from "~/entities/review/types";
import { NavigateFunction } from "@remix-run/react";

export async function fetchData(
  menuType: string | undefined,
  reviews: IReview[] | null,
  mapData: IMapData | undefined,
  cafeDataRef: {
    current: ISearchData[];
  },
  setMarkers: React.Dispatch<React.SetStateAction<IMarker[] | undefined>>,
  clusterer: IClusterer | undefined,
  navigate: NavigateFunction,
  searchKeyword?: string
) {
  try {
    const result = await getCafeData(menuType, reviews, mapData, searchKeyword);
    cafeDataRef.current = [...result.data];
    const markers = createMarker(mapData, cafeDataRef.current, navigate);
    clusterer?.addMarkers(markers);
    setMarkers(markers);
  } catch (e) {
    console.error(e);
  }
}

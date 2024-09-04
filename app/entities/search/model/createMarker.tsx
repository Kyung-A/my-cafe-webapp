import markerImg from "~/assets/marker.png";
import { textWidth } from "../lib/textWidth";
import { IMapData, IMarker, ISearchData } from "../types";
import { NavigateFunction } from "@remix-run/react";

function handleClickMarker(navigate: NavigateFunction, cafe: ISearchData) {
  navigate(`/search/${cafe.id}`, {
    state: {
      x: cafe.x,
      y: cafe.y,
      ...(cafe.review && { review: cafe.review }),
      ...(cafe.reviewId && { reviewId: cafe.reviewId }),
    },
  });
}

export function createMarker(
  mapData: IMapData | undefined,
  data: ISearchData[],
  navigate: NavigateFunction
) {
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
      handleClickMarker(navigate, cafe);
    });
  });

  return markerArr;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { IClusterer, IClusters, IMarker, ISearchData } from "../types";

export function createMarkerOverlay(
  clusterer: IClusterer | undefined,
  clusters: IClusters,
  kakao: any,
  cafeData: { current: ISearchData[] }
) {
  const overlayList: any[] = [];
  const result = _.differenceWith(clusterer?._clusters, clusters, _.isEqual);

  result.forEach((v) => {
    const coords = new kakao.maps.Coords(
      v._center.La.toFixed(1),
      Math.floor(v._center.Ma)
    );
    const position = new kakao.maps.LatLng(
      coords.toLatLng().Ma,
      coords.toLatLng().La
    );

    const cafeInfo = cafeData.current.find(
      (cafe) => cafe.id === v._markers[0].Gb
    );

    const overlay = new kakao.maps.CustomOverlay({
      clickable: true,
      content: `<div class="customOverlay"><p>${cafeInfo?.place_name}</p></div>`,
      position,
      xAnchor: 0.5,
      yAnchor: 1.2,
      zIndex: -1,
    });

    overlayList.push(overlay);
  });
  return overlayList;
}

export function createClusterOverlay(
  clusters: IClusters[],
  kakao: any,
  cafeData: { current: ISearchData[] }
) {
  const overlayList: any[] = [];

  clusters.forEach((v: any) => {
    const coords = new kakao.maps.Coords(
      v._center.La.toFixed(1),
      Math.floor(v._center.Ma)
    );
    const position = new kakao.maps.LatLng(
      coords.toLatLng().Ma,
      coords.toLatLng().La
    );

    const cafeInfoList = cafeData.current.filter((cafe) =>
      v._markers.find((item: IMarker) => cafe.id === item.Gb && cafe)
    );

    const overlay = new kakao.maps.CustomOverlay({
      clickable: true,
      content: `<div class="customOverlay"><p>${cafeInfoList[0]?.place_name}</p><div class="number">+${cafeInfoList.length}</div></div>`,
      position,
      xAnchor: 0.5,
      yAnchor: 0.7,
      zIndex: -1,
    });

    //   const num = textWidth(cafeInfoList[0]?.place_name.length);
    //   v.getClusterMarker().getContent().style.width = `${num}px`;
    overlayList.push(overlay);
  });
  return overlayList;
}

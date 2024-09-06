import { ICoord, IMapData } from "../types";

export function getSingleMarker(
  mapData: IMapData | undefined,
  coord: ICoord,
  isMove: boolean = true
) {
  const { kakao } = window;
  if (!kakao || !mapData) return;

  const position = new kakao.maps.LatLng(coord?.y, coord?.x);
  const marker = new kakao.maps.Marker({
    position: position,
    title: coord?.name,
    zIndex: 30,
  });

  if (isMove) {
    mapData.setCenter(position);
  }
  return marker;
}

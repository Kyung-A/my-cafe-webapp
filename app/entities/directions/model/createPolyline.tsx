/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMapData } from "~/entities/search/types";
import { IPolyline, IRoads } from "../types";

export function createPolyline(
  directions: Record<string, any>,
  mapData: IMapData | undefined
) {
  const { kakao } = window;
  if (!kakao || !mapData) return;

  const linePath: IPolyline[] = [];
  const polylineArr: Record<string, any>[] = [];

  if (directions) {
    directions.routes[0].sections[0].roads.forEach((road: IRoads) => {
      road.vertexes.forEach((vertex: number, idx: number) => {
        if (idx % 2 === 0) {
          linePath.push(
            new kakao.maps.LatLng(road.vertexes[idx + 1], road.vertexes[idx])
          );
        }
      });
      const polyline = new kakao.maps.Polyline({
        map: mapData,
        path: linePath,
        strokeWeight: 5,
        strokeColor: "rgb(54 22 137)",
        strokeOpacity: 0.5,
        strokeStyle: "solid",
      });

      polylineArr.push(polyline);
      polyline.setMap(mapData);
    });
  }

  return polylineArr;
}

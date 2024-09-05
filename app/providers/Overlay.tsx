/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";

import { IMarker } from "../shared/types";
import { useMap } from "./Map";
import { removewOverlay } from "~/entities/search";
import {
  createClusterOverlay,
  createMarkerOverlay,
} from "~/entities/search/model/createOverlay";

interface IOverlay {
  overlayArr: IMarker[];
  listOverlayArr: IMarker[];
}

interface IOverlayProvider {
  children: JSX.Element | JSX.Element[];
}

const OverlayContext = createContext<IOverlay>({
  overlayArr: [],
  listOverlayArr: [],
});

const OverlayProvider = ({ children }: IOverlayProvider) => {
  const { mapData, clusterer, cafeData } = useMap();

  const [overlayArr, setOverlayArr] = useState<IMarker[]>([]);
  const [listOverlayArr, setListOverlayArr] = useState<IMarker[]>([]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !mapData) return;

    kakao.maps.event?.addListener(
      clusterer,
      "clustered",
      function (clusters: any) {
        const overlay1 = createClusterOverlay(clusters, kakao, cafeData);
        const overlay2 = createMarkerOverlay(
          clusterer,
          clusters,
          kakao,
          cafeData
        );

        setOverlayArr([...overlay1, ...overlay2]);

        kakao.maps.event?.addListener(mapData, "idle", function () {
          removewOverlay([...overlay1, ...overlay2]);
        });
      }
    );

    kakao.maps.event?.addListener(
      clusterer,
      "clusterclick",
      function (cluster: any) {
        const position = new kakao.maps.LatLng(
          cluster.getCenter().Ma,
          cluster.getCenter().La
        );

        const cafeInfoList = cafeData.current.filter((cafe) =>
          cluster._markers.find((item: IMarker) => cafe.id === item.Gb && cafe)
        );

        const cafeListOverlay = new kakao.maps.CustomOverlay({
          map: mapData,
          clickable: true,
          content: `<div class="customOverlay-list">${cafeInfoList.map((v) => `<p>${v.place_name}</p>`).join("")}</div>`,
          position,
          xAnchor: 0.5,
          yAnchor: 1,
          zIndex: 40,
        });
        setListOverlayArr([cafeListOverlay]);
      }
    );
  }, [cafeData, clusterer, mapData]);

  useEffect(() => {
    overlayArr.forEach((v) => v.setMap(mapData));
  }, [overlayArr, mapData]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao) return;

    if (listOverlayArr.length >= 1) {
      kakao.maps.event?.addListener(mapData, "idle", function () {
        listOverlayArr[0].setMap(null);
      });
      kakao.maps.event?.addListener(mapData, "click", function () {
        listOverlayArr[0].setMap(null);
      });
      kakao.maps.event?.addListener(clusterer, "clusterclick", function () {
        listOverlayArr[0].setMap(null);
      });
    }
  }, [mapData, listOverlayArr, clusterer]);

  return (
    <OverlayContext.Provider
      value={{
        overlayArr,
        listOverlayArr,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;
export const useOverlay = () => useContext(OverlayContext);

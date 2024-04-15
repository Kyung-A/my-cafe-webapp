/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import _ from "lodash";

import { useRemove } from "~/hooks";
import { IClusterer, IClusters, IMarker } from "../types";
import { useMap } from "./Map";

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
  const { removewOverlay } = useRemove();

  const [overlayArr, setOverlayArr] = useState<IMarker[]>([]);
  const [listOverlayArr, setListOverlayArr] = useState<IMarker[]>([]);

  //   const textWidth = (text: number) => {
  //     if (text > 12) return 200;
  //     if (text > 10 && text <= 12) return 160;
  //     if (text >= 7 && text <= 10) return 130;
  //     if (text >= 5 && text < 8) return 80;
  //     if (text < 5) return 50;
  //   };

  const fetchMarkerInfowindow = (
    clusterer: IClusterer | undefined,
    clusters: IClusters,
    kakao: any
  ) => {
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
  };

  const fetchClustersInfowindow = (clusters: IClusters[], kakao: any) => {
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
  };

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !mapData) return;

    kakao.maps.event?.addListener(
      clusterer,
      "clustered",
      function (clusters: any) {
        const overlay1 = fetchClustersInfowindow(clusters, kakao);
        const overlay2 = fetchMarkerInfowindow(clusterer, clusters, kakao);

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

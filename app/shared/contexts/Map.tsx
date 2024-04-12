/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";
import _ from "lodash";

import marker from "~/assets/marker.png";
import { useGeoLocation, useRemove } from "~/hooks";
import { GNB } from "../consts/gnb";
import {
  ICafePagination,
  ICafeResponse,
  IClusterer,
  IClusters,
  IMarker,
  IMenu,
} from "../types";

interface IMap {
  mapEl: RefObject<HTMLDivElement> | null;
  mapData: { [key: string]: any } | undefined;
  GNB: IMenu[];
  setGNB: Dispatch<SetStateAction<IMenu[]>>;
  cafeData: { current: ICafeResponse[] | null };
  markers: IMarker[];
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
  pagination: ICafePagination | undefined;
  setPagination: Dispatch<SetStateAction<ICafePagination | undefined>>;
  clusterer: { [key: string]: any } | undefined;
  overlayArr: IMarker[];
  listOverlayArr: IMarker[];
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: undefined,
  GNB: [],
  setGNB: () => [],
  cafeData: { current: null },
  markers: [],
  setMarkers: () => [],
  pagination: undefined,
  setPagination: () => null,
  clusterer: undefined,
  overlayArr: [],
  listOverlayArr: [],
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef<HTMLDivElement>(null);
  const cafeData = useRef<ICafeResponse[]>([]);
  const { curLocation } = useGeoLocation();
  const { removewOverlay } = useRemove();

  const [mapData, setMapData] = useState<{ [key: string]: any } | undefined>();
  const [copyGNB, setCopyGNB] = useState<IMenu[]>(GNB);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [pagination, setPagination] = useState<ICafePagination>();
  const [clusterer, setClusterer] = useState<IClusterer>();
  const [overlayArr, setOverlayArr] = useState<IMarker[]>([]);
  const [listOverlayArr, setListOverlayArr] = useState<IMarker[]>([]);

  const textWidth = (text: number) => {
    if (text > 12) return 200;
    if (text > 10 && text <= 12) return 160;
    if (text >= 7 && text <= 10) return 130;
    if (text >= 5 && text < 8) return 80;
    if (text < 5) return 50;
  };

  const fetchMarkerInfowindow = (
    clusterer: IClusterer,
    clusters: IClusters,
    kakao: any
  ) => {
    const overlayList: any[] = [];
    const result = _.differenceWith(clusterer._clusters, clusters, _.isEqual);

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

      const num = textWidth(cafeInfoList[0]?.place_name.length);
      v.getClusterMarker().getContent().style.width = `${num}px`;

      const overlay = new kakao.maps.CustomOverlay({
        clickable: true,
        content: `<div class="customOverlay"><p>${cafeInfoList[0]?.place_name}</p><div class="number">+${cafeInfoList.length}</div></div>`,
        position,
        xAnchor: 0.5,
        yAnchor: 0.7,
        zIndex: -1,
      });

      overlayList.push(overlay);
    });
    return overlayList;
  };

  useEffect(() => {
    const { kakao } = window;
    if (!mapEl.current || !kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 5,
      };

      const map = new kakao.maps.Map(mapEl.current, options);

      const clusterer = new kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 1,
        disableClickZoom: true,
        styles: [
          {
            background: `url(${marker})`,
            width: "60px",
            height: "50px",
            textIndent: "-9999px",
          },
        ],
      });

      setClusterer(clusterer);
      setMapData(map);

      kakao.maps.event.addListener(
        clusterer,
        "clusterclick",
        function (cluster: any) {
          const position = new kakao.maps.LatLng(
            cluster.getCenter().Ma,
            cluster.getCenter().La
          );

          const cafeInfoList = cafeData.current.filter((cafe) =>
            cluster._markers.find(
              (item: IMarker) => cafe.id === item.Gb && cafe
            )
          );

          const cafeListOverlay = new kakao.maps.CustomOverlay({
            map,
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

      kakao.maps.event.addListener(
        clusterer,
        "clustered",
        function (clusters: any) {
          const overlay1 = fetchClustersInfowindow(clusters, kakao);
          const overlay2 = fetchMarkerInfowindow(clusterer, clusters, kakao);

          setOverlayArr([...overlay1, ...overlay2]);

          kakao.maps.event?.addListener(map, "idle", function () {
            removewOverlay([...overlay1, ...overlay2]);
          });
        }
      );
    });
  }, [mapEl, curLocation]);

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
      kakao.maps.event.addListener(mapData, "click", function () {
        listOverlayArr[0].setMap(null);
      });
      kakao.maps.event.addListener(clusterer, "clusterclick", function () {
        listOverlayArr[0].setMap(null);
      });
    }
  }, [mapData, listOverlayArr, clusterer]);

  return (
    <MapContext.Provider
      value={{
        mapEl,
        mapData,
        GNB: copyGNB,
        setGNB: setCopyGNB,
        cafeData,
        markers,
        setMarkers,
        pagination,
        setPagination,
        clusterer,
        overlayArr,
        listOverlayArr,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

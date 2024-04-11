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

import { useGeoLocation } from "~/hooks";
import { GNB } from "../consts/gnb";
import {
  ICafePagination,
  ICafeResponse,
  IClusterer,
  IClusters,
  IKaKao,
  IMarker,
  IMenu,
} from "../types";
import _ from "lodash";

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
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef<HTMLDivElement>(null);
  const cafeData = useRef<ICafeResponse[]>([]);
  const { curLocation } = useGeoLocation();

  const [mapData, setMapData] = useState<{ [key: string]: any } | undefined>();
  const [copyGNB, setCopyGNB] = useState<IMenu[]>(GNB);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [pagination, setPagination] = useState<ICafePagination>();
  const [clusterer, setClusterer] = useState<IClusterer>();

  const fetchMarkerInfowindow = (
    clusterer: IClusterer,
    clusters: IClusters,
    kakao: IKaKao,
    map: any,
    infowindowArr: any[]
  ) => {
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
      const infowindow = new kakao.maps.InfoWindow({
        map,
        position,
        content: '<div style="padding:5px;">Hello World!</div>',
      });

      infowindowArr.push(infowindow);
    });
  };

  const fetchClustersInfowindow = (
    clusters: IClusters[],
    kakao: IKaKao,
    map: any,
    infowindowArr: any[]
  ) => {
    clusters.forEach((v: any) => {
      const coords = new kakao.maps.Coords(
        v._center.La.toFixed(1),
        Math.floor(v._center.Ma)
      );
      const position = new kakao.maps.LatLng(
        coords.toLatLng().Ma,
        coords.toLatLng().La
      );
      const infowindow = new kakao.maps.InfoWindow({
        map,
        position,
        content: '<div style="padding:5px;">Hello World!</div>',
      });

      infowindowArr.push(infowindow);
    });
  };

  const removewInfowindow = (kakao: IKaKao, map: any, infowindowArr: any[]) => {
    kakao.maps.event?.addListener(map, "idle", function () {
      infowindowArr.forEach((v: { close: () => void }) => {
        v.close();
      });
    });
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
        minLevel: 4,
        disableClickZoom: true,
        zIndex: 1,
      });

      setClusterer(clusterer);
      setMapData(map);

      // TODO: 리팩토링 및 컨텐츠 수정
      kakao.maps.event.addListener(
        clusterer,
        "clustered",
        function (clusters: any) {
          const infowindowArr: any[] = [];

          fetchClustersInfowindow(clusters, kakao, map, infowindowArr);
          fetchMarkerInfowindow(clusterer, clusters, kakao, map, infowindowArr);
          removewInfowindow(kakao, map, infowindowArr);
        }
      );
    });
  }, [mapEl, curLocation]);

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
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

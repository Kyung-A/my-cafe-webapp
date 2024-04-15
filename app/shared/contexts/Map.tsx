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

import marker from "~/assets/marker.png";
import { useGeoLocation } from "~/hooks";
import { GNB } from "../consts/gnb";
import {
  ICafePagination,
  ICafeResponse,
  IClusterer,
  IMarker,
  IMenu,
} from "../types";

interface IMap {
  mapEl: RefObject<HTMLDivElement> | null;
  mapData: { [key: string]: any } | undefined;
  GNB: IMenu[];
  setGNB: Dispatch<SetStateAction<IMenu[]>>;
  cafeData: { current: ICafeResponse[] };
  markers: IMarker[];
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
  pagination: ICafePagination | undefined;
  setPagination: Dispatch<SetStateAction<ICafePagination | undefined>>;
  clusterer: IClusterer | undefined;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: undefined,
  GNB: [],
  setGNB: () => [],
  cafeData: { current: [] },
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

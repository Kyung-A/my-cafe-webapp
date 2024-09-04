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
import { IMenu } from "../shared/types";
import { IClusterer, IMarker, ISearchData } from "~/entities/search/types";

interface IMap {
  mapEl: RefObject<HTMLDivElement> | null;
  mapData: { [key: string]: any } | undefined;
  GNB: IMenu[];
  setGNB: Dispatch<SetStateAction<IMenu[]>>;
  cafeData: { current: ISearchData[] };
  markers: IMarker[] | undefined;
  setMarkers: Dispatch<SetStateAction<IMarker[] | undefined>>;
  clusterer: IClusterer | undefined;
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  isIdle: boolean;
  setIdle: Dispatch<SetStateAction<boolean>>;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const GNB = [
  {
    id: "default",
    name: "카페 보기",
    active: false,
  },
  {
    id: "visited",
    name: "방문한 카페",
    active: false,
  },
  {
    id: "search",
    name: "검색",
    active: false,
  },
];

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: undefined,
  GNB: [],
  setGNB: () => [],
  cafeData: { current: [] },
  markers: [],
  setMarkers: () => [],
  clusterer: undefined,
  searchInput: "",
  setSearchInput: () => "",
  isIdle: false,
  setIdle: () => false,
});

function MapProvider({ children }: IMapProvider) {
  const mapEl = useRef<HTMLDivElement>(null);
  const cafeData = useRef<ISearchData[]>([]);
  const { curLocation } = useGeoLocation();

  const [mapData, setMapData] = useState<{ [key: string]: any } | undefined>();
  const [copyGNB, setCopyGNB] = useState<IMenu[]>(GNB);
  const [markers, setMarkers] = useState<IMarker[] | undefined>([]);
  const [clusterer, setClusterer] = useState<IClusterer>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [isIdle, setIdle] = useState<boolean>(false);

  useEffect(() => {
    const { kakao } = window;
    if (!mapEl.current || !kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 4,
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
        clusterer,
        searchInput,
        setSearchInput,
        isIdle,
        setIdle,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export default MapProvider;
export const useMap = () => useContext(MapContext);

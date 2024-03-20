/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { useGeoLocation } from "~/hooks";
import { GNB } from "../consts/gnb";
import { ICafePagination, ICafeResponse, IMarker, IMenu } from "../types";

interface IMap {
  mapEl: MutableRefObject<ReactNode> | null;
  mapData: { [key: string]: any } | undefined;
  GNB: IMenu[];
  setGNB: Dispatch<SetStateAction<IMenu[]>>;
  cafeData: { current: ICafeResponse[] | null };
  markers: IMarker[];
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
  pagination: ICafePagination | undefined;
  setPagination: Dispatch<SetStateAction<ICafePagination | undefined>>;
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
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef<ReactNode | null>(null);
  const cafeData = useRef<ICafeResponse[]>([]);
  const { curLocation } = useGeoLocation();

  const [mapData, setMapData] = useState<{ [key: string]: any } | undefined>();
  const [copyGNB, setCopyGNB] = useState<IMenu[]>(GNB);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [pagination, setPagination] = useState<ICafePagination>();

  useEffect(() => {
    const { kakao } = window;
    if (!mapEl.current || !kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 6,
      };

      const map = new kakao.maps.Map(mapEl.current, options);
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
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

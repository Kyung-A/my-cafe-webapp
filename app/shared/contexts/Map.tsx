/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
  useState,
} from "react";
import { useGeoLocation } from "~/hooks";
import { lnb } from "../consts/tabs";
import { IMenu } from "../types";

interface IMap {
  mapEl: MutableRefObject<any> | null;
  mapData: any;
  lnb: IMenu[];
  setLnb: React.Dispatch<React.SetStateAction<IMenu[]>>;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: {},
  lnb: [],
  setLnb: () => [],
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef(null);
  const { location } = useGeoLocation();

  const [mapData, setMapData] = useState();
  const [copyLnb, setCopyLnb] = useState<IMenu[]>(lnb);

  useEffect(() => {
    const { kakao } = window;
    if (!mapEl.current || !kakao || !location) return;
    const { latitude, longitude } = location;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 5,
      };

      const map = new kakao.maps.Map(mapEl.current, options);
      setMapData(map);
    });
  }, [mapEl, location]);

  return (
    <MapContext.Provider
      value={{
        mapEl: mapEl,
        mapData: mapData,
        lnb: copyLnb,
        setLnb: setCopyLnb,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

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

interface IMap {
  mapEl: MutableRefObject<any> | null;
  mapData: any;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapEl: null,
  mapData: {},
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapEl = useRef(null);
  const { location } = useGeoLocation();
  const [mapData, setMapData] = useState();

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
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

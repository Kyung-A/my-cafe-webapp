import {
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
import { useGeoLocation } from "~/hooks";

interface IMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRef: MutableRefObject<any> | null;
}

interface IMapProvider {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<IMap>({
  mapRef: null,
});

const MapProvider = ({ children }: IMapProvider) => {
  const mapRef = useRef(null);
  const { location } = useGeoLocation();

  useEffect(() => {
    const { kakao } = window;
    if (!mapRef.current || !kakao || !location) return;
    const { latitude, longitude } = location;

    kakao.maps.load(() => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 5,
      };

      new kakao.maps.Map(mapRef.current, options);
    });
  }, [mapRef, location]);

  return (
    <MapContext.Provider
      value={{
        mapRef: mapRef,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
export const useMap = () => useContext(MapContext);

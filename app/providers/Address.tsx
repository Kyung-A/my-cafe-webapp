/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IGeocoder } from "../shared/types";
import { useMap } from "./Map";
import { useGeoLocation } from "~/shared/hooks/useGeoLocation";

interface IAddress {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
}

interface IAddressProvider {
  children: JSX.Element | JSX.Element[];
}

const AddressContext = createContext<IAddress>({
  address: "",
  setAddress: () => "",
});

function AddressProvider({ children }: IAddressProvider) {
  const { curLocation } = useGeoLocation();
  const { mapData, setIdle } = useMap();

  const [address, setAddress] = useState<string>("");

  const getGeocoder = useCallback((kakao: any, lon: number, lat: number) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(
      lon,
      lat,
      (result: IGeocoder[], status: string) => {
        if (status === kakao.maps.services.Status.OK) {
          setAddress(
            `${result[0].region_1depth_name} ${result[0].region_2depth_name}`
          );
        }
      }
    );
  }, []);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      getGeocoder(kakao, longitude, latitude);
    });
  }, [curLocation]);

  useEffect(() => {
    const { kakao } = window;
    if (!mapData || !kakao) return;

    kakao.maps.event?.addListener(mapData, "idle", function () {
      const { La, Ma } = mapData.getCenter();
      getGeocoder(kakao, La, Ma);
      setIdle(true);
    });
  }, [mapData]);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export default AddressProvider;
export const useAddress = () => useContext(AddressContext);

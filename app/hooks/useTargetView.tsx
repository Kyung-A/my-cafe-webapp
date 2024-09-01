import { useCallback } from "react";
import { useMap } from "~/providers/Map";
import { useGeoLocation } from "./useGeoLocation";

export function useTargetView() {
  const { mapData } = useMap();
  const { curLocation } = useGeoLocation();

  const targetView = useCallback(() => {
    const { kakao } = window;
    if (!kakao || !curLocation || !mapData) return;

    const { latitude, longitude } = curLocation;
    mapData.panTo(new kakao.maps.LatLng(latitude, longitude));
  }, [curLocation, mapData]);

  return { targetView };
}

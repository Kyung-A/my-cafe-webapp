import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useMap } from "~/shared/contexts/Map";
import { IMarker, IReview } from "~/shared/types";

interface locationState {
  y: string;
  x: string;
  name: string;
}

export function useMoveTheMap(coord: IReview | locationState | null) {
  const location = useLocation();
  const { mapData } = useMap();
  const [marker, setMarker] = useState<IMarker | null>(null);

  useEffect(() => {
    if (location.state?.prevUrl && location.state.prevUrl.includes("/users")) {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const position = new kakao.maps.LatLng(coord?.y, coord?.x);
      const marker = new kakao.maps.Marker({
        position: position,
        title: coord?.name,
        zIndex: 30,
      });

      setMarker(marker);
      mapData.setCenter(position);
    }
  }, [coord, mapData, location]);

  useEffect(() => {
    if (!mapData) return;
    if (marker) {
      marker?.setMap(mapData);
    }
  }, [marker, mapData]);

  return { marker, setMarker };
}

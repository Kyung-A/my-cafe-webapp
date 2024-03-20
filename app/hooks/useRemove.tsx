import { useCallback } from "react";

import { useMap } from "~/shared/contexts/Map";
import { IMarker } from "~/shared/types";

export function useRemove() {
  const { markers, setMarkers, cafeData } = useMap();

  const removeMarker = useCallback(() => {
    markers.forEach((v: IMarker) => v.setMap(null));
    setMarkers([]);
  }, [markers, setMarkers]);

  const removeData = () => {
    cafeData.current = [];
  };

  return { removeMarker, removeData };
}

import { useCallback } from "react";

import { useMap } from "~/providers/Map";
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

  const removewOverlay = (arr: IMarker[]) => {
    arr.forEach((v) => {
      v.setMap(null);
    });
  };

  return { removeMarker, removeData, removewOverlay };
}

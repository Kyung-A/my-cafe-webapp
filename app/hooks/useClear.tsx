import { useCallback } from "react";
import { useMap } from "~/shared/contexts/Map";
import { useRemove } from "./useRemove";
import { useOverlay } from "~/shared/contexts/Overlay";
import { useLocation, useNavigate } from "@remix-run/react";

export function useClear() {
  const navigate = useNavigate();
  const location = useLocation();

  const { GNB, setGNB, clusterer, setSearchInput, setIdle } = useMap();
  const { removeData, removeMarker, removewOverlay } = useRemove();
  const { overlayArr, listOverlayArr } = useOverlay();

  const handleClear = useCallback(() => {
    setGNB(GNB.map((v) => ({ ...v, active: false })));
    removeData();
    removeMarker();
    removewOverlay(overlayArr);
    listOverlayArr[0]?.setMap(null);
    clusterer?.clear();
    setSearchInput("");
    setIdle(false);

    if (!location.pathname.includes("directions")) {
      navigate("/search");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    GNB,
    clusterer,
    listOverlayArr,
    location.pathname,
    navigate,
    overlayArr,
    removeData,
    removeMarker,
    removewOverlay,
  ]);

  return { handleClear };
}

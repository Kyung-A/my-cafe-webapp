import { Dispatch, SetStateAction } from "react";
import { IClusterer, IMarker, ISearchData } from "../types";

export function removeMarker(
  markers: IMarker[] | undefined,
  setMarkers: Dispatch<SetStateAction<IMarker[] | undefined>>
) {
  markers?.forEach((v: IMarker) => v.setMap(null));
  setMarkers([]);
}

export function removeSingleMarker(
  marker: IMarker | null,
  setMarker: (value: React.SetStateAction<IMarker | null>) => void
) {
  marker?.setMap(null);
  setMarker(null);
}

export function removeCafeData(cafeData: { current: ISearchData[] }) {
  cafeData.current = [];
}

export function removewOverlay(overlay: IMarker[], listOverlayArr: IMarker[]) {
  overlay.forEach((v) => {
    v.setMap(null);
  });
  listOverlayArr[0]?.setMap(null);
}

export function removeClusterer(clusterer: IClusterer | undefined) {
  clusterer?.clear();
}

export function allRemove(
  markers: IMarker[] | undefined,
  setMarkers: Dispatch<SetStateAction<IMarker[] | undefined>>,
  cafeData: { current: ISearchData[] },
  overlay: IMarker[],
  listOverlayArr: IMarker[],
  clusterer: IClusterer | undefined
) {
  removeMarker(markers, setMarkers);
  removeCafeData(cafeData);
  removewOverlay(overlay, listOverlayArr);
  removeClusterer(clusterer);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function handleRemovePolyline(
  polylines: Record<string, any>[] | undefined
) {
  polylines?.forEach((v) => v.setMap(null));
}

export function handleRemoveAll(
  startMarker: Record<string, any> | undefined,
  endMarker: Record<string, any> | undefined,
  polylines: Record<string, any>[] | undefined
) {
  endMarker?.setMap(null);
  startMarker?.setMap(null);
  handleRemovePolyline(polylines);
}

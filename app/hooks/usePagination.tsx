import { useCallback } from "react";

import { useRemove } from ".";
import { useMap } from "~/shared/contexts/Map";

export function usePagination() {
  const { clusterer } = useMap();
  const { removeMarker } = useRemove();
  const { pagination } = useMap();

  const handlePagination = useCallback(() => {
    if (pagination?.hasNextPage) {
      removeMarker();
      clusterer?.clear();
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  return { handlePagination };
}

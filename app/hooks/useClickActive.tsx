import { useCallback } from "react";
import { useLocation, useNavigate } from "@remix-run/react";

import { useMap } from "~/providers/Map";
import { IReview } from "~/shared/types";
import { useFetch } from "./useFetch";

export function useClickActive() {
  const navigate = useNavigate();
  const location = useLocation();

  const { GNB, setGNB, mapData } = useMap();
  const { fetchCafeData } = useFetch();

  const handleActive = (id: string) => {
    setGNB(
      GNB.map((v) =>
        v.id === id ? { ...v, active: true } : { ...v, active: false }
      )
    );
  };

  const handleMenu = useCallback(
    (id: string, userReview: IReview[] | null) => {
      handleActive(id);
      fetchCafeData(id, userReview);
    },
    [navigate, mapData, location]
  );

  return { handleActive, handleMenu };
}

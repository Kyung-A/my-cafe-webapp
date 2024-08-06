import { useCallback } from "react";
import { useLocation, useNavigate, useOutletContext } from "@remix-run/react";

import { useMap } from "~/shared/contexts/Map";
import { IRegister, IReview } from "~/shared/types";
import { useFetch } from "./useFetch";

export function useClickActive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext<{ user: IRegister }>();

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
    [navigate, user, mapData, location]
  );

  return { handleActive, handleMenu };
}

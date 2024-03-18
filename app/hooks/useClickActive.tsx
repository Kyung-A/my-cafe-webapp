import { useMap } from "~/shared/contexts/Map";

export function useClickActive() {
  const { GNB, setGNB } = useMap();

  const handlerActive = (id: string) => {
    setGNB(
      GNB.map((v) =>
        v.id === id ? { ...v, active: true } : { ...v, active: false }
      )
    );
  };

  return { handlerActive };
}

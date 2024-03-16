import { useMap } from "~/shared/contexts/Map";

export default function useClickActive() {
  const { lnb, setLnb } = useMap();

  const handlerActive = (id: string) => {
    setLnb(
      lnb.map((v) =>
        v.id === id ? { ...v, active: true } : { ...v, active: false }
      )
    );
  };

  return { handlerActive };
}

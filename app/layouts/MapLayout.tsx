import { Panel } from "~/layouts";
import { useMap } from "~/shared/contexts/Map";

export const MapLayout = ({ children }: { children: React.ReactNode }) => {
  const { mapEl } = useMap();

  return (
    <div ref={mapEl} id="map" className="relative h-screen w-full">
      <Panel>{children}</Panel>
    </div>
  );
};

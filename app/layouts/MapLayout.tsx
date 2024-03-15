import { Panel } from "~/layouts";
import { useMap } from "~/shared/contexts/Map";

export const MapLayout = ({ children }: { children: React.ReactNode }) => {
  const { mapRef } = useMap();

  return (
    <div ref={mapRef} id="map" className="relative h-screen w-full">
      <Panel>{children}</Panel>
    </div>
  );
};

import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { Panel } from "~/components";
import { useMap } from "~/shared/contexts/Map";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export default function MainLayoutRoute() {
  const { mapEl } = useMap();

  return (
    <div ref={mapEl} id="map" className="relative h-screen w-full">
      <Panel>
        <Outlet />
      </Panel>
    </div>
  );
}

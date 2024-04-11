import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import { getUser } from "~/.server/storage";

import { Panel } from "~/components";
import { useMap } from "~/shared/contexts/Map";
import chevronRight from "~/assets/chevronRight.svg";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json(user);
}

export default function MainLayoutRoute() {
  const [isPanelOpen, setPanelOpen] = useState(false);

  const location = useLocation();
  const user = useLoaderData<typeof loader>();
  const { mapEl } = useMap();

  return (
    <div ref={mapEl} id="map" className="relative h-screen w-full">
      <Panel open={isPanelOpen}>
        <Outlet context={{ user }} />
        <button
          onClick={() => setPanelOpen((prev) => !prev)}
          className={`absolute top-1/2 z-10 -mt-6 h-12 w-5 ${location.pathname === "/search" ? "-right-5" : "-right-[340px]"}`}
        >
          <div className="flex h-full w-full items-center justify-center bg-white">
            <img
              src={chevronRight}
              className={`w-4 ${isPanelOpen ? "" : "rotate-180"}`}
              alt="패널여닫"
            />
          </div>
        </button>
      </Panel>
    </div>
  );
}

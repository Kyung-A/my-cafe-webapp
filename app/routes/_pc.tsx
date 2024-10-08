import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useMemo, useState } from "react";
import { getUser } from "~/.server/storage";

import { Panel } from "~/shared/ui";
import { useMap } from "~/providers/Map";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json(user);
}

export default function MainPCLayoutRoute() {
  const [isPanelOpen, setPanelOpen] = useState(false);

  const location = useLocation();
  const user = useLoaderData<typeof loader>();
  const { mapEl } = useMap();

  const url = useMemo(
    () =>
      location.pathname === "/search" ||
      location.pathname === "/users" ||
      location.pathname === "/directions",
    [location.pathname]
  );

  const isUsersPage = useMemo(
    () => location.state?.prevUrl && location.state?.prevUrl.includes("/users"),
    [location.state?.prevUrl]
  );

  return (
    <div ref={mapEl} id="map" className="relative h-screen w-full">
      <Panel open={isPanelOpen}>
        <Outlet context={{ user }} />
        <button
          onClick={() => setPanelOpen((prev) => !prev)}
          className={`absolute top-1/2 z-10 -mt-6 h-12 w-5 ${isUsersPage ? "hidden" : ""} ${url ? "-right-5" : "-right-[340px]"}`}
        >
          <div className="flex h-full w-full items-center justify-center bg-white">
            <ChevronRightIcon
              className={`w-4 ${isPanelOpen ? "" : "rotate-180"}`}
            />
          </div>
        </button>
      </Panel>
    </div>
  );
}

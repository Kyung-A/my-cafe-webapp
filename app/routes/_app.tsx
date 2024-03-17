import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/.server/storage";

import { Panel } from "~/components";
import { useMap } from "~/shared/contexts/Map";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json({ user });
}

export default function MainLayoutRoute() {
  const user = useLoaderData<typeof loader>();
  const { mapEl } = useMap();

  return (
    <div ref={mapEl} id="map" className="relative h-screen w-full">
      <Panel>
        <Outlet context={{ user: user }} />
      </Panel>
    </div>
  );
}

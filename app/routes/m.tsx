import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useMemo, useState } from "react";
import { getUser } from "~/.server/storage";
import { Header } from "~/components/mobile";

import { useMap } from "~/shared/contexts/Map";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

// export async function loader({ request }: { request: Request }) {
//   const user = await getUser(request);
//   if (!user) return null;
//   return json(user);
// }

export default function MainMobileLayoutRoute() {
  //   const [isPanelOpen, setPanelOpen] = useState(false);

  //   const location = useLocation();
  // const user = useLoaderData<typeof loader>();
  const { mapEl, GNB } = useMap();

  // const test = () => {
  //   handleClear();
  //   handleMenu("default");
  // };

  return (
    <div
      ref={mapEl}
      id="map"
      className="relative mx-auto h-screen w-full max-w-[480px] overflow-hidden"
    >
      <Outlet />
      <Header gnb={GNB} />
    </div>
  );
}

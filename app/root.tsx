import { LinksFunction, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import MapProvider from "./shared/contexts/Map";
import OverlayProvider from "./shared/contexts/Overlay";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 110 110%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>",
  },
];

export async function loader() {
  return json({
    mapKey: process.env.MAP_KEY,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { mapKey } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {mapKey && (
          <script
            async
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapKey}&libraries=services,clusterer&autoload=false`}
          ></script>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MapProvider>
      <OverlayProvider>
        <Outlet />
      </OverlayProvider>
    </MapProvider>
  );
}

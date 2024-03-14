import type { MetaFunction } from "@remix-run/node";
import { useEffect, useRef } from "react";
import { Panel } from "~/layouts";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export default function Index() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { naver } = window;
    if (!mapRef.current || !naver) return;

    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 13,
    };

    new naver.maps.Map(mapRef.current, mapOptions);
  }, [mapRef]);

  return (
    <div ref={mapRef} className="w-full h-screen relative">
      <Panel>
        <div className="w-full p-4 bg-primary">
          <div className="bg-white w-full flex items-center justify-between">
            <input
              type="search"
              placeholder="찾으시는 카페가 있으신가요?"
              className="outline-none border-none p-2 box-border w-[90%]"
            />
            <button className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

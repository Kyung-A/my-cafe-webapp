/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, Outlet } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, SearchForm } from "~/components";
import { useGeoLocation } from "~/hooks";
import { useMap } from "~/shared/contexts/Map";
import { gnb } from "~/shared/consts/tabs";
import {
  ICafePagination,
  ICafeResponse,
  IGeocoder,
  IMarketPostion,
} from "~/shared/types";
import useClickActive from "~/hooks/useClickActive";

export default function CafeSearchRoute() {
  const { mapData, lnb, setLnb } = useMap();
  const { location } = useGeoLocation();
  const { handlerActive } = useClickActive();

  const [address, setAddress] = useState<string>();
  const [cafeData, setCafeData] = useState<ICafeResponse[]>([]);
  const [markers, setMarkers] = useState<{ [key: string]: any }[]>([]);
  const [pagination, setPagination] = useState<ICafePagination>();

  const isActiveLnb = useMemo(() => lnb.find((v) => v.active), [lnb]);

  const addMarker = useCallback(
    (position: IMarketPostion) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const imageSrc = "https://t1.daumcdn.net/mapjsapi/images/2x/marker.png";
      const imageSize = new kakao.maps.Size(28, 40);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      const marker = new kakao.maps.Marker({
        position: position,
        image: markerImage,
      });
      marker.setMap(mapData);
      return marker;
    },
    [mapData]
  );

  const removeMarket = useCallback(() => {
    if (markers) {
      markers.forEach((v) => v.setMap(null));
      setMarkers([]);
    }
  }, [markers]);

  const fetchData = useCallback(() => {
    const { kakao } = window;
    if (!kakao || !mapData) return;

    const ps = new kakao.maps.services.Places(mapData);
    ps.categorySearch(
      "CE7",
      (data: ICafeResponse[], status: string, paging: ICafePagination) => {
        if (status !== kakao.maps.services.Status.OK) return;

        const markerArr: { [key: string]: any }[] = [];
        data.map((v) => {
          const marker = addMarker(new kakao.maps.LatLng(v.y, v.x));
          markerArr.push(marker);
        });

        setPagination(paging);
        setMarkers(markerArr);
        setCafeData(data);
      },
      { useMapBounds: true }
    );
  }, [mapData, addMarker]);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !location) return;
    const { latitude, longitude } = location;

    kakao.maps.load(() => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(
        longitude,
        latitude,
        (result: IGeocoder[], status: string) => {
          if (status === kakao.maps.services.Status.OK) {
            setAddress(
              `${result[0].region_1depth_name} ${result[0].region_2depth_name}`
            );
          }
        }
      );
    });
  }, [location]);

  return (
    <div>
      <div className="bg-primary w-full px-4 py-4">
        <SearchForm />
        <ul className="mt-5 flex items-center justify-between">
          {gnb.map((v) => (
            <li key={v.id} className="w-1/2">
              <Link
                to={v.href}
                className={`block w-full rounded-full py-1 text-center ${v.active ? "bg-interaction font-semibold text-white" : ""}`}
              >
                {v.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {!isActiveLnb ? (
          <div className="px-4 pb-40 pt-6">
            <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {lnb?.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => {
                      handlerActive(v.id);
                      fetchData();
                    }}
                    className={`border-primary w-full rounded border px-4 py-2 text-left ${v.active ? "bg-interaction border-interaction font-semibold text-white" : ""}`}
                  >
                    {v.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="px-4 pb-2 pt-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setLnb(lnb.map((v) => ({ ...v, active: false })));
                    removeMarket();
                    setCafeData([]);
                  }}
                  className="flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                    />
                  </svg>
                  <p className="text-xs">뒤로가기</p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (pagination?.hasPrevPage) {
                        pagination?.gotoPage(pagination.current - 1);
                        removeMarket();
                        setCafeData([]);
                      }
                    }}
                    className={`text-interaction flex items-center gap-2 ${pagination?.hasPrevPage ? "text-interaction" : "pointer-events-none text-neutral-400"}`}
                  >
                    <p className="text-xs">이전 보기</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (pagination?.hasNextPage) {
                        pagination?.gotoPage(pagination.current + 1);
                        removeMarket();
                        setCafeData([]);
                      }
                    }}
                    className={`text-interaction flex items-center gap-2 ${pagination?.hasNextPage ? "text-interaction" : "pointer-events-none text-neutral-400"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>

                    <p className="text-xs">다음 보기</p>
                  </button>
                </div>
              </div>
              <h2 className="text-md mt-1 font-semibold leading-6">
                {address} 주변 <br />
              </h2>
              <h3 className="text-interaction text-xl font-semibold ">
                {isActiveLnb.name}
              </h3>
            </div>
            <div className="h-screen w-full overflow-y-auto px-4 pb-[300px]">
              <ul className="mt-2 flex flex-col gap-6">
                {cafeData?.map((v) => (
                  <Link to={v.id} key={v.id}>
                    <Card data={v} />
                  </Link>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <Outlet />
    </div>
  );
}

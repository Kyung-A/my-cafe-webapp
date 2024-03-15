import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { SearchForm } from "~/components";
import { useGeoLocation } from "~/hooks";
import { MapLayout, Panel } from "~/layouts";
import { useMap } from "~/shared/contexts/Map";
import { gnb, lnb } from "~/shared/consts/tabs";
import { IGeocoder } from "~/shared/types";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export default function CafeSearchRoute() {
  const { mapData } = useMap();
  const { location } = useGeoLocation();

  const [address, setAddress] = useState<string>();
  const [copyLnb, setCopyLnb] = useState(lnb);

  const fetchCafeData = useCallback(
    (id: string) => {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const ps = new kakao.maps.services.Places(mapData);
      ps.categorySearch(
        "CE7",
        (data, status, paging) => {
          console.log(data, status, paging);
        },
        { useMapBounds: true }
      );
    },
    [mapData]
  );

  const handlerActive = useCallback(
    (id: string) => {
      setCopyLnb(
        copyLnb.map((v) =>
          v.id === id ? { ...v, active: true } : { ...v, active: false }
        )
      );
      fetchCafeData(id);
    },
    [copyLnb, fetchCafeData]
  );

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
    <MapLayout>
      <div className="bg-primary w-full px-4 py-6">
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
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {copyLnb?.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => handlerActive(v.id)}
                className={`border-primary w-full rounded border px-4 py-2 text-left ${v.active ? "bg-interaction border-interaction font-semibold text-white" : ""}`}
              >
                {v.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* <Panel left="320px">
        <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
          <h1 className="text-xl font-semibold">XX식당</h1>
        </div>
        <div className="h-40 w-full bg-neutral-100"></div>
        <div className="h-full w-full overflow-y-auto">
          <div className="px-4 pb-60 pt-6">
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <p>리뷰수 234</p>
              <p>|</p>
              <p>별점 3.5 / 5</p>
            </div>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start gap-3">
                <div className="flex min-w-20 items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="font-semibold">영업시간</p>
                </div>
                <div>
                  <p>브레이크 타임</p>
                  <p>00:00 ~ 24:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex min-w-20 items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                    />
                  </svg>

                  <p className="font-semibold">위치</p>
                </div>
                <p className="break-keep">서울 영등포구 신길로61길 21 1층</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex min-w-20 items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <p className="font-semibold">전화번호</p>
                </div>
                <p>010-1234-5678</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex min-w-20 items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                  <p className="font-semibold">메뉴</p>
                </div>
                <details className="w-full">
                  <summary>메뉴 상세보기</summary>
                  <ul>
                    <li className="border-b-[1px] border-neutral-100 py-2">
                      <div className="h-20 w-2/3 overflow-hidden rounded bg-neutral-100"></div>
                      <div className="mt-2 space-y-1">
                        <p className=" font-semibold">카페라떼</p>
                        <p className="text-sm">5,500원</p>
                      </div>
                    </li>
                    <li className="border-b-[1px] border-neutral-100 py-2">
                      <div className="h-20 w-2/3 overflow-hidden rounded bg-neutral-100"></div>
                      <div className="mt-2 space-y-1">
                        <p className="font-semibold">카페라떼</p>
                        <p className="text-sm">5,500원</p>
                      </div>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
            <hr className="my-6 text-neutral-100" />
            <div className="w-full">
              <p className="text-lg font-semibold">☕ 나의 후기</p>
              <div className="mt-10 flex w-full flex-col items-center justify-center">
                <p>등록된 후기가 없습니다.</p>
                <button className="bg-interaction mt-2 rounded-full px-3 py-1 text-sm font-semibold text-white">
                  후기 등록하기
                </button>
              </div>
              <div className="mt-2 rounded bg-neutral-100 px-3 py-2">
                <p>
                  t is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed to using Content
                  here, content here, making it look like readable English. Many
                  desktop publishing packages and web page editors now use Lorem
                  Ipsum as their default model text, and a search for lorem
                  ipsum will uncover many web sites still in their infancy.
                  Various versions have evolved over the years, sometimes by
                  accident, sometimes on purpose (injected humour and the like).
                </p>
                <button className="text-interaction mt-3 flex items-center gap-2 font-semibold">
                  후기 자세히 보러가기
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Panel> */}

      {/* <Panel left="320px">
        <div className="bg-primary flex h-12 w-full items-center justify-between px-4">
          <h1 className="text-xl font-semibold">XX식당 후기 등록</h1>
          <button className="bg-interaction rounded-full px-4 py-1 font-semibold">
            저장
          </button>
        </div>
        <div className="h-full w-full overflow-y-auto">
          <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
            <div>
              <p className="text-lg font-semibold">☕ 후기</p>
              <textarea
                placeholder="후기를 자유롭게 작성해주세요."
                className="mt-2 h-24 w-full resize-none rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
              ></textarea>
            </div>
            <div>
              <p className="text-lg font-semibold">👍 장점</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between overflow-hidden rounded border border-neutral-300">
                  <input
                    type="text"
                    className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                    placeholder="장점을 입력해주세요."
                  />
                  <button className="pr-2 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                </div>
                <button className="bg-interaction mt-4 rounded-full px-4 py-1 text-sm font-semibold text-white">
                  추가
                </button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">👎 단점</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between overflow-hidden rounded border border-neutral-300">
                  <input
                    type="text"
                    className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                    placeholder="단점을 입력해주세요."
                  />
                  <button className="pr-2 text-neutral-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />
                    </svg>
                  </button>
                </div>
                <button className="bg-interaction mt-4 rounded-full px-4 py-1 text-sm font-semibold text-white">
                  추가
                </button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">💛 추천메뉴</p>
              <input
                type="text"
                className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
                placeholder="추천메뉴를 입력해주세요."
              />
            </div>
            <div>
              <p className="text-lg font-semibold">🏷️ 태그</p>
              <input
                type="text"
                className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
                placeholder="태그를 입력해주세요."
              />
            </div>
            <div>
              <p className="text-lg font-semibold">⭐ 별점</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  max={5}
                  min={0}
                  defaultValue={0}
                  step={0.5}
                  className="w-20 rounded border border-neutral-300 px-3 py-1 outline-none placeholder:text-neutral-300"
                  placeholder="별점"
                />
                <p className="text-lg">/ 5</p>
              </div>
            </div>
          </div>
        </div>
      </Panel> */}
    </MapLayout>
  );
}

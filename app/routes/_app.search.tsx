/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card, SearchForm } from "~/components";
import { useClickActive, useGeoLocation } from "~/hooks";
import { useMap } from "~/shared/contexts/Map";
import { ICafeResponse, IGeocoder, IRegister, IReview } from "~/shared/types";
import { getReviewList } from "~/.server/review";

export async function loader({ request }: { request: Request }) {
  const result = await getReviewList(request);
  return json(result);
}

export default function CafeSearchRoute() {
  const navigate = useNavigate();
  const userReview = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IRegister }>();

  const {
    handlePagination,
    GNB,
    setGNB,
    fetchCafeData,
    cafeData,
    removeData,
    removeMarker,
    refetchCafeData,
  } = useMap();
  const { location } = useGeoLocation();
  const { handlerActive } = useClickActive();

  const oldReview = useRef<any>(null);
  const [observerRef, setObserverRef] = useState<null | HTMLDivElement>(null);
  const [address, setAddress] = useState<string>();

  const isActiveLnb = useMemo(() => GNB.find((v) => v.active), [GNB]);

  const onScroll = useCallback(
    (entries: any) => {
      if (!entries[0].isIntersecting) return;
      handlePagination();
    },
    [handlePagination]
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

  useEffect(() => {
    if (!observerRef) return;
    const observer = new IntersectionObserver(onScroll, { threshold: 0.1 });
    observer.observe(observerRef);

    if (cafeData.current.length === 45) observer.unobserve(observerRef);
    return () => observer.disconnect();
  }, [onScroll, observerRef, cafeData]);

  useEffect(() => {
    oldReview.current = userReview;
  }, []);

  useEffect(() => {
    let changeReview: any;
    const newIdArr = userReview?.map((v) => v.cafeId);
    const oldIdArr = oldReview.current?.map((v: IReview) => v.cafeId);
    const id = newIdArr?.filter((x) => !oldIdArr?.includes(x));

    if (userReview && oldReview.current) {
      userReview?.forEach((cur) => {
        oldReview.current.forEach((old: IReview) => {
          if (cur.cafeId === old.cafeId) {
            if (cur.description !== old.description) changeReview = cur;
            if (cur.visited !== old.visited) changeReview = cur;
            if (cur.booking !== old.booking) changeReview = cur;
          }
        });
        if (id && id.length > 0) {
          if (cur.cafeId === id[0]) {
            changeReview = cur;
          }
        }
      });
    } else {
      if (userReview && userReview?.length > 0) {
        changeReview = userReview[0];
      }
    }

    if (changeReview) {
      refetchCafeData(changeReview);
      oldReview.current = userReview;
    }
  }, [refetchCafeData, userReview]);

  return (
    <div>
      <div className="bg-primary w-full px-4 py-4">
        <div className="mb-2 flex items-center gap-2 text-white">
          <button
            onClick={() => {
              navigate("/search");
              setGNB(GNB.map((v) => ({ ...v, active: false })));
              removeData();
              removeMarker();
            }}
          >
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <h1>myCafe</h1>
        </div>
        <SearchForm />
      </div>
      <div>
        {!isActiveLnb ? (
          <div className="px-4 pb-40 pt-6">
            <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {GNB?.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (v.id !== "default" && user === null) {
                        navigate("/signin");
                      } else {
                        handlerActive(v.id);
                        fetchCafeData(v.id, userReview);
                      }
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
              <h2 className="text-md mt-1 font-semibold leading-6">
                {address} 주변 <br />
              </h2>
              <h3 className="text-interaction text-xl font-semibold ">
                {isActiveLnb.name}
              </h3>
            </div>
            <div className="h-screen w-full overflow-y-auto px-4 pb-[200px]">
              <ul className="mt-2 flex min-h-[500px] flex-col gap-6">
                {cafeData.current && (
                  <>
                    {cafeData.current.map((v: ICafeResponse) => (
                      <Link
                        to={v.id}
                        key={v.id}
                        state={{ review: v.review, reviewId: v.reviewId }}
                      >
                        <Card data={v} />
                      </Link>
                    ))}
                  </>
                )}
              </ul>
              <div ref={setObserverRef} className="h-1"></div>
            </div>
          </>
        )}
      </div>
      <Outlet context={userReview} />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card, SearchForm } from "~/components";
import {
  useClickActive,
  useFetch,
  useGeoLocation,
  useKeyword,
  usePagination,
  useRemove,
} from "~/hooks";
import { useMap } from "~/shared/contexts/Map";
import {
  ICafeResponse,
  ICoord,
  IGeocoder,
  IRegister,
  IReview,
} from "~/shared/types";
import { getReviewList } from "~/.server/review";
import bar3 from "~/assets/bar3.svg";

export async function loader({ request }: { request: Request }) {
  const result = await getReviewList(request);
  return json(result);
}

export default function CafeSearchRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const userReview = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IRegister }>();

  const { removeData, removeMarker, removewOverlay } = useRemove();
  const { handlePagination } = usePagination();
  const { fetchCafeData, refetchCafeData } = useFetch();
  const { GNB, cafeData, setGNB, clusterer, overlayArr, listOverlayArr } =
    useMap();
  const { curLocation } = useGeoLocation();
  const { handleActive } = useClickActive();
  const { searchKeyword } = useKeyword();

  const keyword = useRef<string | null>(null);
  const oldReview = useRef<any>(null);
  const [observerRef, setObserverRef] = useState<null | HTMLDivElement>(null);
  const [address, setAddress] = useState<string>();
  const [searchInput, setSearchInput] = useState<string>("");
  const [coordinate, setCoordinate] = useState<ICoord | null>();

  const isActiveLnb = useMemo(() => GNB.find((v) => v.active), [GNB]);

  const handleEnter = useCallback(
    (e: { key: string }, text: string) => {
      if (e.key === "Enter") {
        keyword.current = text;
        handleActive("search");
        searchKeyword(text, userReview as IReview[]);
      }
    },
    [handleActive, searchKeyword, userReview]
  );

  const handleSearch = useCallback(
    (text: string) => {
      keyword.current = text;
      handleActive("search");
      searchKeyword(text, userReview as IReview[]);
    },
    [handleActive, searchKeyword, userReview]
  );

  const onScroll = useCallback(
    (entries: any) => {
      if (!entries[0].isIntersecting) return;
      handlePagination();

      if (cafeData.current?.length !== 45) {
        removewOverlay(overlayArr);
      }
      if (listOverlayArr.length > 0) {
        listOverlayArr[0]?.setMap(null);
      }
    },
    [handlePagination, overlayArr, listOverlayArr, cafeData]
  );

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

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
  }, [curLocation]);

  useEffect(() => {
    if (!observerRef) return;
    const observer = new IntersectionObserver(onScroll, { threshold: 0.1 });
    observer.observe(observerRef);

    if (cafeData.current?.length === 45) observer.unobserve(observerRef);
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

  useEffect(() => {
    if (!location.pathname.includes("directions")) {
      setCoordinate(null);
    }
  }, [location.pathname]);

  return (
    <div>
      <div className="bg-primary w-full px-4 py-4">
        <div className="mb-2 flex items-center gap-2 text-white">
          <button
            onClick={() => {
              setGNB(GNB.map((v) => ({ ...v, active: false })));
              removeData();
              removeMarker();
              removewOverlay(overlayArr);
              listOverlayArr[0]?.setMap(null);
              clusterer?.clear();
              setSearchInput("");
              if (!location.pathname.includes("directions")) {
                navigate("/search");
              }
            }}
          >
            <img src={bar3} alt="gnb" className="w-5" />
          </button>
          <h1>myCafe</h1>
        </div>
        <SearchForm
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleEnter={handleEnter}
          onSubmit={handleSearch}
        />
      </div>
      <div>
        {!isActiveLnb ? (
          <div className="px-4 pb-40 pt-6">
            <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {GNB.map((v) => (
                <li key={v.id}>
                  {v.id !== "search" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (v.id !== "default" && user === null) {
                            navigate("/signin");
                          } else {
                            handleActive(v.id);
                            fetchCafeData(v.id, userReview as IReview[]);
                          }
                        }}
                        className={`border-primary w-full rounded border px-4 py-2 text-left ${v.active ? "bg-interaction border-interaction font-semibold text-white" : ""}`}
                      >
                        {v.name}
                      </button>
                    </>
                  )}
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
              <h3 className="text-interaction text-xl font-semibold">
                {isActiveLnb.id === "search"
                  ? `${keyword.current} ${isActiveLnb.name}`
                  : isActiveLnb.name}
              </h3>
            </div>
            <div className="h-screen w-full overflow-y-auto px-4 pb-[200px]">
              {cafeData.current && cafeData.current?.length > 0 ? (
                <>
                  <ul className="mt-2 flex min-h-[550px] flex-col gap-6">
                    {cafeData.current.map((v: ICafeResponse) => {
                      const directions =
                        location.pathname.includes("directions");

                      return directions ? (
                        <div
                          key={v.id}
                          onClick={() =>
                            setCoordinate({
                              name: v.place_name,
                              x: v.x,
                              y: v.y,
                            })
                          }
                          aria-hidden="true"
                        >
                          <Card data={v} user={user} />
                        </div>
                      ) : (
                        <Link
                          to={v.id}
                          key={v.id}
                          state={{
                            x: v.x,
                            y: v.y,
                            review: v.review,
                            reviewId: v.reviewId,
                          }}
                        >
                          <Card data={v} user={user} />
                        </Link>
                      );
                    })}
                  </ul>
                  {isActiveLnb.id !== "visited" && (
                    <div ref={setObserverRef} className="h-1"></div>
                  )}
                  {isActiveLnb.id === "visited" &&
                    cafeData.current?.length >= 15 && (
                      <div ref={setObserverRef} className="h-1"></div>
                    )}
                </>
              ) : (
                <div className="h-full w-full pt-36">
                  <p className="text-center">
                    후기를 등록해서 <br /> 나만의 카페 목록을 만드세요!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Outlet context={{ userReview, coordinate }} />
    </div>
  );
}

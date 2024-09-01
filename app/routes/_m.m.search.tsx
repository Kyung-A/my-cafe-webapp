/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  json,
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import { getUser } from "~/.server/storage";
import { Card } from "~/shared/ui";
import { useMap } from "~/providers/Map";
import { ICafeResponse, ICoord } from "~/shared/types";
import {
  ClockIcon,
  ArrowLongRightIcon,
  ClipboardIcon,
  MapPinIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

interface IOutletContext {
  address: string;
  isActiveMenu: { id: string; name: string; active: boolean };
  keyword: string;
  setFullSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json(user);
}

export default function MobileCafeSearchRoute() {
  const user = useLoaderData<typeof loader>();
  const fetcher = useFetcher<any>();
  const { address, isActiveMenu, keyword, setFullSheet } =
    useOutletContext<IOutletContext>();
  const location = useLocation();
  const navigate = useNavigate();

  const [, setCoordinate] = useState<ICoord | null>();
  const [curCafe, setCurCafe] = useState<any>();

  const { cafeData, pagination } = useMap();

  const handleBackReset = useCallback(() => {
    setCurCafe(null);
    setFullSheet(false);
  }, []);

  useEffect(() => {
    if (pagination?.hasNextPage) {
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  useEffect(() => {
    if (fetcher.data) {
      setFullSheet(true);
      setCurCafe((prev: any) => ({ ...prev, ...fetcher.data }));
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (location.state?.cafeId) {
      fetcher.load(`/m/${location.state?.cafeId}`);
      setFullSheet(true);
      setCurCafe({
        ...fetcher.data,
        cafeId: location.state.cafeId,
        x: location.state.x,
        y: location.state.y,
        review: location.state.review,
        reviewId: location.state.reviewId,
      });
    }
  }, [location.state?.cafeId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (location.state) {
        navigate(location.pathname, { replace: true, state: null });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location, navigate]);

  return (
    <>
      {curCafe && curCafe?.basicInfo ? (
        <>
          <div className="flex items-center gap-x-2 px-6 pb-4">
            <button onClick={handleBackReset} className="w-6" type="button">
              <ChevronLeftIcon className="w-full" />
            </button>
            <h1 className="break-keep text-xl font-semibold leading-6">
              {curCafe?.basicInfo.placenamefull}
            </h1>
          </div>
          <div className="overflow-y-auto px-6 pb-52">
            <div className="h-40 w-full overflow-hidden bg-neutral-100">
              <img
                src={curCafe?.basicInfo.mainphotourl}
                alt="cafe img"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-4 pt-6">
              <div className="mb-2 flex items-center gap-3 text-sm text-neutral-400">
                <p>리뷰수 {curCafe?.basicInfo.feedback.blogrvwcnt}</p>
                <p>|</p>
                <p>
                  별점{" "}
                  {(
                    curCafe?.basicInfo.feedback.scoresum /
                    curCafe?.basicInfo.feedback.scorecnt
                  ).toFixed(1)}{" "}
                  / 5
                </p>
              </div>
              {/* <Link
                  to="/search/directions"
                  state={{
                    x: location.state.x,
                    y: location.state.y,
                    name: curCafe?.basicInfo.placenamefull,
                    position: "start",
                  }}
                  onClick={() => {
                    marker?.setMap(null);
                    setMarker(null);
                  }}
                  className="border-interaction text-interaction inline-block rounded-full border px-4 py-[2px] text-sm font-semibold"
                >
                  출발
                </Link>
                <Link
                  to="/search/directions"
                  state={{
                    x: location.state.x,
                    y: location.state.y,
                    name: curCafe?.basicInfo.placenamefull,
                    position: "end",
                  }}
                  onClick={() => {
                    marker?.setMap(null);
                    setMarker(null);
                  }}
                  className="bg-interaction border-interaction ml-1 inline-block rounded-full border px-4 py-[2px] text-sm font-semibold text-white"
                >
                  도착
                </Link> */}
              <ul className="mt-2 space-y-2">
                <li className="flex items-start gap-3">
                  <div className="flex min-w-20 items-center gap-1">
                    <ClockIcon className="w-5" />
                    <p className="font-semibold">영업시간</p>
                  </div>
                  <div>
                    <p>
                      {curCafe?.basicInfo?.openHour?.realtime.open === "N"
                        ? "영업마감"
                        : "영업중"}
                    </p>
                    {curCafe?.basicInfo?.openHour?.periodList[0].timeList.map(
                      (v: any, i: number) => (
                        <p key={i}>
                          {v.timeSE} {v.dayOfWeek}
                        </p>
                      )
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex min-w-20 items-center gap-1">
                    <MapPinIcon className="w-5" />
                    <p className="font-semibold">위치</p>
                  </div>
                  <p className="break-keep">
                    {curCafe?.basicInfo.address.region.fullname}{" "}
                    {curCafe?.basicInfo.address.addrbunho}{" "}
                    {curCafe?.basicInfo.address.addrdetail}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex min-w-20 items-center gap-1">
                    <ClipboardIcon className="w-5" />
                    <p className="font-semibold">메뉴</p>
                  </div>
                  <details className="w-full cursor-pointer outline-none">
                    <summary>메뉴 상세보기</summary>
                    <ul>
                      {curCafe?.menuInfo?.menuList.map((v: any, i: number) => (
                        <li
                          key={i}
                          className="border-b-[1px] border-neutral-200 py-3 last:border-b-0"
                        >
                          {v.img && (
                            <div className="h-20 w-2/3 overflow-hidden rounded bg-neutral-100">
                              <img
                                src={v.img}
                                alt="food img"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="mt-2 space-y-1">
                            <p className=" font-semibold">{v.menu}</p>
                            <p className="text-sm">{v.price}원</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              </ul>
              <hr className="my-6 text-neutral-100" />
              <div className="w-full">
                <p className="text-lg font-semibold">☕ 나의 후기</p>
                {curCafe?.review ? (
                  <div className="mt-2 rounded bg-neutral-100 px-3 py-4">
                    <p>{curCafe?.review}</p>
                    <Link
                      to={`/m/review/${curCafe?.reviewId}`}
                      state={{
                        prevUrl: location.pathname,
                        cafeId: curCafe.cafeId,
                        name: curCafe.basicInfo.placenamefull,
                        x: curCafe?.x,
                        y: curCafe?.y,
                      }}
                      className="text-interaction mt-3 flex items-center gap-2 text-sm font-semibold"
                    >
                      후기 자세히 보러가기
                      <ArrowLongRightIcon className="w-[18px]" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-10 flex w-full flex-col items-center justify-center">
                    <p>등록된 후기가 없습니다.</p>
                    <Link
                      to="/m/reviewForm"
                      state={{
                        cafeId: curCafe.cafeId,
                        name: curCafe.basicInfo.placenamefull,
                        x: curCafe?.x,
                        y: curCafe?.y,
                      }}
                      className="bg-interaction mt-2 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    >
                      후기 등록하기
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-6">
            <h2 className="text-md font-semibold leading-6">
              {address} 주변 <br />
            </h2>
            <h3 className="text-interaction text-xl font-semibold">
              {isActiveMenu.id === "search"
                ? `${keyword} ${isActiveMenu.name}`
                : isActiveMenu.name}
            </h3>
          </div>
          <div className="overflow-y-auto px-6 pb-52">
            {!pagination?.hasNextPage && cafeData.current.length > 0 && (
              <div className="mt-4 flex flex-col gap-6">
                {cafeData.current.map((v: ICafeResponse) => {
                  const directions = location.pathname.includes("directions");

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
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                    <div
                      onClick={() => {
                        fetcher.load(`/m/${v.id}`);
                        setCurCafe({
                          cafeId: v.id,
                          x: v.x,
                          y: v.y,
                          review: v.review,
                          reviewId: v.reviewId,
                        });
                      }}
                      key={v.id}
                      className="text-left"
                    >
                      <Card data={v} user={user} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

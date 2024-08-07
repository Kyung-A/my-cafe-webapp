/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Card,
  Menu,
  ProfileEditDialog,
  SearchForm,
  TargetViewButton,
} from "~/components";
import {
  useClear,
  useClickActive,
  useFetch,
  useGeoLocation,
  useKeyword,
  useRemove,
  useTargetView,
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
import { useOverlay } from "~/shared/contexts/Overlay";
import { getUser } from "~/.server/storage";
import bar3 from "~/assets/bar3.svg";
import refresh from "~/assets/refresh.svg";
import edit from "~/assets/edit.svg";
import UserIcon from "~/assets/user";

export async function loader({ request }: { request: Request }) {
  const user: IRegister | null = await getUser(request);
  if (!user?.id) return null;

  const result = await getReviewList(user?.id);
  return json(result);
}

export default function CafeSearchRoute() {
  const location = useLocation();
  const userReview = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IRegister }>();

  const { removeData, removeMarker, removewOverlay } = useRemove();
  const { fetchCafeData, refetchCafeData } = useFetch();
  const {
    GNB,
    cafeData,
    clusterer,
    pagination,
    mapData,
    searchInput,
    setSearchInput,
    isIdle,
    setIdle,
  } = useMap();
  const { overlayArr, listOverlayArr } = useOverlay();
  const { curLocation } = useGeoLocation();
  const { handleActive, handleMenu } = useClickActive();
  const { searchKeyword } = useKeyword();
  const { targetView } = useTargetView();
  const { handleClear } = useClear();

  const keyword = useRef<string | null>(null);
  const oldReview = useRef<any>(null);
  const searchLocation = useRef<string | null | undefined>(null);

  const [address, setAddress] = useState<string>();
  const [coordinate, setCoordinate] = useState<ICoord | null>();
  const [isOpen, setOpened] = useState<boolean>(false);

  const isActiveMenu = useMemo(() => GNB.find((v) => v.active), [GNB]);

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

  const getGeocoder = useCallback((kakao: any, lon: number, lat: number) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(
      lon,
      lat,
      (result: IGeocoder[], status: string) => {
        if (status === kakao.maps.services.Status.OK) {
          setAddress(
            `${result[0].region_1depth_name} ${result[0].region_2depth_name}`
          );
        }
      }
    );
  }, []);

  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !curLocation) return;
    const { latitude, longitude } = curLocation;

    kakao.maps.load(() => {
      getGeocoder(kakao, longitude, latitude);
    });
  }, [curLocation]);

  useEffect(() => {
    const { kakao } = window;
    if (!mapData || !kakao) return;

    kakao.maps.event?.addListener(mapData, "idle", function () {
      const { La, Ma } = mapData.getCenter();
      getGeocoder(kakao, La, Ma);
      setIdle(true);
    });
  }, [mapData]);

  useEffect(() => {
    if (!isActiveMenu) {
      searchLocation.current = address;
    }
  }, [address, isActiveMenu]);

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

  useEffect(() => {
    if (pagination?.hasNextPage) {
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  return (
    <>
      <div>
        <div className="bg-primary w-full px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-white">
            <button onClick={handleClear}>
              <img src={bar3} alt="gnb" className="w-5" />
            </button>
            <h1>myCafe</h1>
          </div>
          <SearchForm
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleEnter={handleEnter}
            onSubmit={handleSearch}
            isActiveMenu={isActiveMenu}
          />
        </div>
        {/* 프로필 */}
        {!isActiveMenu && user && (
          <div className="mb-2 px-4 pt-6">
            <h2 className="text-lg font-semibold">
              👋 안녕하세요 {user.name}님!
            </h2>
            <div className="relative mt-2 flex w-full items-center">
              <button onClick={() => setOpened(true)}>
                <div className="bg-trueGray-100 absolute bottom-0 left-12 h-5 w-5 rounded-full p-[3px]">
                  <img src={edit} alt="프로필 수정" />
                </div>
                <div className="h-16 w-16 overflow-hidden rounded-full">
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt="프로필 이미지"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-full fill-neutral-300" />
                  )}
                </div>
              </button>
              <div className="flex-1">
                <p className="break-keep pl-3 text-sm">{user.email}</p>
                <table className="mt-1 w-full text-left text-xs">
                  <tbody>
                    <tr>
                      <th className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                        리뷰수
                      </th>
                      <th className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                        팔로워
                      </th>
                      <th className="text-trueGray-500 w-1/3 px-3 font-normal">
                        팔로잉
                      </th>
                    </tr>
                    <tr>
                      <td className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                        {user._count?.review}
                      </td>
                      <td className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                        {user._count?.followers}
                      </td>
                      <td className="text-trueGray-500 w-1/3 px-3 font-normal">
                        {user._count?.following}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* 탐색 */}
        <div>
          {!isActiveMenu ? (
            <div className="px-4 pt-6">
              <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleClear();
                      handleMenu("default", userReview as IReview[]);
                    }}
                    className="border-primary w-full rounded border px-4 py-2 text-left"
                  >
                    카페 보기
                  </button>
                </li>
                <li>
                  <Link
                    to="/users?filter=ranking"
                    state={{ filter: "ranking" }}
                    className="block w-full"
                  >
                    <Menu name="베스트 리뷰어" />
                  </Link>
                  {user && (
                    <Link
                      to="/users?filter=follow"
                      state={{ filter: "follow" }}
                      className="mt-2 block w-full"
                    >
                      <Menu name="나의 팔로잉 목록" />
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <>
              <div className="px-4 pb-2 pt-6">
                <h2 className="text-md mt-1 font-semibold leading-6">
                  {isActiveMenu.id !== "search" && (
                    <>
                      {searchLocation.current} 주변 <br />
                    </>
                  )}
                </h2>
                <h3 className="text-interaction text-xl font-semibold">
                  {isActiveMenu.id === "search"
                    ? `${keyword.current} ${isActiveMenu.name}`
                    : isActiveMenu.name}
                </h3>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      handleClear();
                      if (isActiveMenu.id === "visited") {
                        handleMenu("default", userReview as IReview[]);
                      } else {
                        handleMenu("visited", userReview as IReview[]);
                      }
                    }}
                    className={`border-primary rounded-full border px-2 py-[2px] text-xs ${isActiveMenu.id === "visited" ? "bg-primary font-semibold text-white" : "text-zinc-400"}`}
                  >
                    방문한 카페
                  </button>
                </div>
              </div>
              <div className="h-screen w-full overflow-y-auto px-4 pb-[220px]">
                {!pagination?.hasNextPage && cafeData.current.length > 0 && (
                  <div className="mt-2 flex flex-col gap-6">
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
                          to={v.x && v.y && v.id}
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
                  </div>
                )}
                {user === null ? (
                  <div className="flex h-full w-full flex-col items-center pt-36">
                    <p className="text-center">로그인이 필요한 서비스입니다.</p>
                    <Link
                      to="/signin"
                      className="bg-interaction mx-auto mt-3 inline-block rounded-full px-8 py-2 text-center text-sm font-semibold text-white"
                    >
                      로그인 하기
                    </Link>
                  </div>
                ) : (
                  (!pagination || !pagination?.hasNextPage) &&
                  cafeData.current.length === 0 && (
                    <div className="h-full w-full pt-36">
                      <p className="text-center">카페를 찾지 못 했습니다.</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
        <Outlet context={{ userReview, coordinate }} />
      </div>
      {isActiveMenu && location.pathname === "/search" && isIdle && (
        <button
          onClick={() => {
            // remove
            removeData();
            removeMarker();
            removewOverlay(overlayArr);
            listOverlayArr[0]?.setMap(null);
            clusterer?.clear();
            setIdle(false);
            // fetch
            if (isActiveMenu.id === "search") {
              handleSearch(searchInput);
            } else {
              setSearchInput("");
              fetchCafeData(isActiveMenu.id, userReview as IReview[]);
            }
            searchLocation.current = address;
          }}
          className="bg-primary fixed bottom-6 left-1/2 z-50 ml-14 rounded-full px-5 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-5">
              <img src={refresh} alt="새로고침" />
            </div>
            <span className="font-bold text-white">현 지도에서 검색</span>
          </div>
        </button>
      )}
      <TargetViewButton onClick={targetView} />
      {user && (
        <ProfileEditDialog user={user} isOpen={isOpen} setOpened={setOpened} />
      )}
    </>
  );
}

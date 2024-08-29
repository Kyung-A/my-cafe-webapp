import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getReviewList } from "~/.server/review";
import { getUser } from "~/.server/storage";
import { SearchForm } from "~/components";
import { Header, BottomSheet } from "~/components/mobile";
import { useClickActive, useFetch, useKeyword, useRemove } from "~/hooks";
import { useAddress } from "~/shared/contexts/Address";

import { useMap } from "~/shared/contexts/Map";
import { useOverlay } from "~/shared/contexts/Overlay";
import { IRegister, IReview } from "~/shared/types";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export async function loader({ request }: { request: Request }) {
  const user: IRegister | null = await getUser(request);
  if (!user?.id) return null;

  const result = await getReviewList(user?.id);
  return json(result);
}

export default function MobileMainLayoutRoute() {
  const userReview = useLoaderData<typeof loader>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fullSheet, setFullSheet] = useState<boolean>(true);

  const { handleMenu } = useClickActive();
  const {
    mapEl,
    GNB,
    mapData,
    clusterer,
    setIdle,
    isIdle,
    searchInput,
    setSearchInput,
  } = useMap();
  const { removeData, removeMarker, removewOverlay } = useRemove();
  const { overlayArr, listOverlayArr } = useOverlay();
  const { fetchCafeData } = useFetch();
  const { address } = useAddress();
  const { handleEnter, handleSearch, keyword } = useKeyword();

  const isActiveMenu = useMemo(() => GNB.find((v) => v.active), [GNB]);
  const handleHeader = useCallback(
    (type: string) => {
      const isActive = GNB.some((v) => v.id === type && v.active === true);
      if (isActive) return;
      handleMenu(type, userReview as IReview[]);
    },
    [userReview, mapData, GNB]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRefetch = useCallback(() => {
    if (!isActiveMenu) return;

    removeData();
    removeMarker();
    removewOverlay(overlayArr);
    listOverlayArr[0]?.setMap(null);
    clusterer?.clear();
    setIdle(false);

    if (isActiveMenu.id === "search") {
      handleSearch(searchInput, userReview as IReview[]);
    } else {
      setSearchInput("");
      fetchCafeData(isActiveMenu.id, userReview as IReview[]);
    }
    searchLocation.current = address;
  }, [
    address,
    clusterer,
    isActiveMenu,
    listOverlayArr,
    overlayArr,
    searchInput,
    userReview,
  ]);

  const searchLocation = useRef<string | null | undefined>(null);
  useEffect(() => {
    searchLocation.current = address;
  }, [address]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={mapEl}
      id="map"
      onMouseUp={handleTouchEnd}
      className="relative mx-auto h-screen w-full max-w-[480px] overflow-hidden"
    >
      <div className="bg-primary relative z-10 w-full px-4 py-3 ">
        <h1 className="mb-2 flex items-center gap-2 text-white">myCafe</h1>
        <SearchForm
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleEnter={handleEnter}
          onSubmit={handleSearch}
          isActiveMenu={isActiveMenu}
          userReview={userReview as IReview[]}
        />
      </div>
      {isActiveMenu && isIdle && (
        <button
          onClick={handleRefetch}
          className="bg-primary fixed left-1/2 top-28 z-50 -ml-20 rounded-full px-5 py-2 shadow-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-5">
              <ArrowPathIcon className="text-white" />
            </div>
            <span className="font-bold text-white">현 지도에서 검색</span>
          </div>
        </button>
      )}

      {isActiveMenu && (
        <BottomSheet
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          fullSheet={fullSheet}
        >
          <Outlet
            context={{
              address: searchLocation.current,
              isActiveMenu,
              keyword,
              setFullSheet,
            }}
          />
        </BottomSheet>
      )}
      <Header handleHeader={handleHeader} isActiveMenu={isActiveMenu} />
    </div>
  );
}

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
import { useEffect, useMemo, useRef, useState } from "react";

import { Card, SearchForm, TargetViewButton } from "~/shared/ui";
import { useMap } from "~/providers/Map";
import { ICafeResponse, IRegister, IReview } from "~/shared/types";
import { useOverlay } from "~/providers/Overlay";
import { getUser } from "~/.server/storage";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAddress } from "~/providers/Address";
import { allRemove, updateData } from "~/entities/search";
import {
  CafeListHeader,
  fetchData,
  RefetchButton,
  SubNav,
} from "~/features/search";
import { Profile, ProfileEditDialog } from "~/features/user";
import { IProfile } from "~/entities/user/types";
import { NavList, NoCafe, NoUser } from "~/widgets/search";
import { usePreservedCallback } from "~/shared/hooks/usePreservedCallback";
import { reviewApi } from "~/entities/review";
import { useGeoLocation } from "~/shared/hooks/useGeoLocation";

export async function loader({ request }: { request: Request }) {
  const user: IRegister | null = await getUser(request);
  if (!user?.id) return null;

  const result = await reviewApi(user?.id);
  return json(result);
}

export default function CafeSearchRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const userReview = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IProfile }>();

  const {
    GNB,
    cafeData,
    clusterer,
    searchInput,
    setSearchInput,
    isIdle,
    setIdle,
    mapData,
    setMarkers,
    setGNB,
    markers,
  } = useMap();
  const { overlayArr, listOverlayArr } = useOverlay();
  const { address } = useAddress();
  const { curLocation } = useGeoLocation();

  const oldReview = useRef<any>(null);
  const keyword = useRef<string | null>(null);
  const searchLocation = useRef<string | null | undefined>(null);
  const [isOpen, setOpened] = useState<boolean>(false);

  const isActiveMenu = useMemo(() => GNB.find((v) => v.active), [GNB]);

  const handleTargetView = usePreservedCallback(() => {
    const { kakao } = window;
    if (!kakao || !curLocation || !mapData) return;

    const { latitude, longitude } = curLocation;
    mapData.panTo(new kakao.maps.LatLng(latitude, longitude));
  });

  const handleInteraction = usePreservedCallback(
    (
      event: { type: string; key: string; preventDefault: () => void },
      type: string,
      text: string
    ) => {
      if (
        event.type === "click" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        keyword.current = text;
        handleFetch(type, text);
      }
    }
  );

  const handleFetch = usePreservedCallback((type: string, keyword?: string) => {
    allRemove(
      markers,
      setMarkers,
      cafeData,
      overlayArr,
      listOverlayArr,
      clusterer
    );
    setGNB(
      GNB.map((v) =>
        v.id === type ? { ...v, active: true } : { ...v, active: false }
      )
    );
    fetchData(
      type,
      userReview,
      mapData,
      cafeData,
      setMarkers,
      clusterer,
      navigate,
      keyword
    );
  });

  const handleRefetch = usePreservedCallback(
    (event: { type: string; key: string; preventDefault: () => void }) => {
      if (!isActiveMenu) return;
      allRemove(
        markers,
        setMarkers,
        cafeData,
        overlayArr,
        listOverlayArr,
        clusterer
      );
      setIdle(false);

      if (isActiveMenu?.id === "search") {
        handleInteraction(event, "search", searchInput);
      } else {
        setSearchInput("");
        fetchData(
          isActiveMenu?.id,
          userReview,
          mapData,
          cafeData,
          setMarkers,
          clusterer,
          navigate
        );
      }
      searchLocation.current = address;
    }
  );

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
      updateData(cafeData, changeReview);
      oldReview.current = userReview;
    }
  }, [userReview]);

  return (
    <>
      <div>
        <div className="bg-primary w-full px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-white">
            <button
              onClick={() => {
                navigate("/search");
                allRemove(
                  markers,
                  setMarkers,
                  cafeData,
                  overlayArr,
                  listOverlayArr,
                  clusterer
                );
                setGNB(GNB.map((v) => ({ ...v, active: false })));
                setSearchInput("");
                setIdle(false);
              }}
            >
              <Bars3Icon className="w-5" />
            </button>
            <h1>myCafe</h1>
          </div>
          <SearchForm
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleInteraction={handleInteraction}
            userReview={userReview as IReview[]}
          />
        </div>
        {!isActiveMenu && user && <Profile user={user} setOpened={setOpened} />}
        <div>
          {!isActiveMenu ? (
            <NavList
              address={address}
              user={!user ? false : true}
              handleFetch={() => handleFetch("default")}
            />
          ) : (
            <>
              <div className="px-4 pb-2 pt-6">
                <CafeListHeader
                  isActiveMenu={isActiveMenu}
                  searchLocation={searchLocation.current}
                  keyword={keyword.current}
                />
                {isActiveMenu.id !== "search" && (
                  <SubNav
                    isActiveMenu={isActiveMenu?.id}
                    onClick={() => {
                      if (isActiveMenu.id === "visited") {
                        handleFetch("default");
                      } else {
                        handleFetch("visited");
                      }
                    }}
                  />
                )}
              </div>
              <div className="h-screen w-full overflow-y-auto px-4 pb-[220px]">
                {cafeData.current.length > 0 && (
                  <div className="mt-2 flex flex-col gap-6">
                    {cafeData.current.map((v: ICafeResponse) => (
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
                    ))}
                  </div>
                )}
                {user === null && isActiveMenu.id === "visited" && <NoUser />}
                {cafeData.current.length === 0 && <NoCafe />}
              </div>
            </>
          )}
        </div>
        <Outlet context={{ userReview, user }} />
      </div>
      {isActiveMenu && location.pathname === "/search" && isIdle && (
        <RefetchButton handleRefetch={handleRefetch} />
      )}
      <TargetViewButton onClick={handleTargetView} />
      {user && (
        <ProfileEditDialog user={user} isOpen={isOpen} setOpened={setOpened} />
      )}
    </>
  );
}

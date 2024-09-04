/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";

import { getCafeDetail } from "~/.server/search";
import { Panel } from "~/shared/ui";
import {
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import { IRegister } from "~/entities/auth/types";
import { useEffect, useMemo, useState } from "react";
import { getSingleMarker } from "~/entities/search/model/getSingleMarker";
import { useMap } from "~/providers/Map";
import { IMarker } from "~/entities/search/types";
import { removeSingleMarker } from "~/entities/search";
import { CafeInfo, DirectionsLink } from "~/widgets/cafe";

interface IParams {
  params: {
    cafeId: string;
  };
}

export async function loader({ params }: IParams) {
  const { cafeId } = params;
  const result = await getCafeDetail(cafeId);
  return json(result);
}

export default function CafeDetailRoute() {
  const data = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IRegister }>();
  const { cafeId } = useParams<string>();
  const { mapData } = useMap();
  const location = useLocation();
  const navigate = useNavigate();

  const [marker, setMarker] = useState<IMarker | null>(null);

  const hasPrevUrl = useMemo(
    () => location.state?.prevUrl && location.state?.prevUrl.includes("/users"),
    [location.state?.prevUrl]
  );

  useEffect(() => {
    if (hasPrevUrl) {
      const marker = getSingleMarker(mapData, location.state);
      marker.setMap(mapData);
    }
  }, [hasPrevUrl, location.state, mapData]);

  return (
    <Panel left={`${hasPrevUrl ? "0px" : "320px"}`}>
      <div
        className={`bg-primary flex w-full items-center px-4 py-3 ${hasPrevUrl ? "gap-2" : "justify-between "}`}
      >
        {hasPrevUrl && (
          <button
            onClick={() => {
              navigate(-1);
              removeSingleMarker(marker, setMarker);
            }}
            className="w-6"
          >
            <ArrowLongLeftIcon />
          </button>
        )}
        <h1 className="break-keep text-xl font-semibold leading-6">
          {data.basicInfo.placenamefull}
        </h1>
      </div>
      <div className="h-40 w-full overflow-hidden bg-neutral-100">
        <img
          src={data.basicInfo.mainphotourl}
          alt="cafe img"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="px-4 pb-60 pt-6">
          <DirectionsLink
            onClick={() => removeSingleMarker(marker, setMarker)}
            state={{
              x: location.state.x,
              y: location.state.y,
              name: data.basicInfo.placenamefull,
              position: "start",
            }}
            text="출발"
          />
          <DirectionsLink
            onClick={() => removeSingleMarker(marker, setMarker)}
            state={{
              x: location.state.x,
              y: location.state.y,
              name: data.basicInfo.placenamefull,
              position: "end",
            }}
            text="도착"
          />
          <CafeInfo data={data} />
          <hr className="my-6 text-neutral-100" />
          <div className="w-full">
            <p className="text-lg font-semibold">☕ 나의 후기</p>
            {location.state.review ? (
              <div className="mt-2 rounded bg-neutral-100 px-3 py-4">
                <p>{location.state.review}</p>
                <Link
                  to={`/search/review/${location.state.reviewId}`}
                  state={{ prevUrl: location.pathname }}
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
                  to={!user ? "/signin" : "/search/reviewForm"}
                  state={{
                    cafeId: cafeId,
                    name: data.basicInfo.placenamefull,
                    x: location.state.x,
                    y: location.state.y,
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
    </Panel>
  );
}

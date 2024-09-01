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
import { useMoveTheMap } from "~/hooks";
import {
  ClockIcon,
  ArrowLongRightIcon,
  ClipboardIcon,
  MapPinIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import { IRegister } from "~/entities/auth/types";

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
  const location = useLocation();
  const navigate = useNavigate();

  const { marker, setMarker } = useMoveTheMap(location.state);

  return (
    <Panel
      left={`${location.state?.prevUrl && location.state.prevUrl.includes("/users") ? "0px" : "320px"}`}
    >
      <div
        className={`bg-primary flex w-full items-center px-4 py-3 ${location.state?.prevUrl && location.state?.prevUrl.includes("/users") ? "gap-2" : "justify-between "}`}
      >
        {location.state?.prevUrl &&
          location.state?.prevUrl.includes("/users") && (
            <button
              onClick={() => {
                navigate(-1);
                marker?.setMap(null);
                setMarker(null);
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
          <div className="mb-2 flex items-center gap-3 text-sm text-neutral-400">
            <p>리뷰수 {data.basicInfo.feedback.blogrvwcnt}</p>
            <p>|</p>
            <p>
              별점{" "}
              {(
                data.basicInfo.feedback.scoresum /
                data.basicInfo.feedback.scorecnt
              ).toFixed(1)}{" "}
              / 5
            </p>
          </div>
          <Link
            to="/search/directions"
            state={{
              x: location.state.x,
              y: location.state.y,
              name: data.basicInfo.placenamefull,
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
              name: data.basicInfo.placenamefull,
              position: "end",
            }}
            onClick={() => {
              marker?.setMap(null);
              setMarker(null);
            }}
            className="bg-interaction border-interaction ml-1 inline-block rounded-full border px-4 py-[2px] text-sm font-semibold text-white"
          >
            도착
          </Link>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start gap-3">
              <div className="flex min-w-20 items-center gap-1">
                <ClockIcon className="w-5" />
                <p className="font-semibold">영업시간</p>
              </div>
              <div>
                <p>
                  {data.basicInfo?.openHour?.realtime.open === "N"
                    ? "영업마감"
                    : "영업중"}
                </p>
                {data.basicInfo?.openHour?.periodList[0].timeList.map(
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
                {data.basicInfo.address.region.fullname}{" "}
                {data.basicInfo.address.addrbunho}{" "}
                {data.basicInfo.address.addrdetail}
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
                  {data.menuInfo?.menuList.map((v: any, i: number) => (
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

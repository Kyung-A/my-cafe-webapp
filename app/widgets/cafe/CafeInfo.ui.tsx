/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClockIcon,
  ClipboardIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

type ICafeData = Record<string, any>;

export function CafeInfo({ data }: ICafeData) {
  return (
    <>
      <div className="my-2 flex items-center gap-3 text-sm text-neutral-400">
        <p>리뷰수 {data.basicInfo.feedback.blogrvwcnt}</p>
        <p>|</p>
        <p>
          별점{" "}
          {(
            data.basicInfo.feedback.scoresum / data.basicInfo.feedback.scorecnt
          ).toFixed(1)}{" "}
          / 5
        </p>
      </div>
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
    </>
  );
}

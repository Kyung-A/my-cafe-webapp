import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import getCafeDetail from "~/.server/search";
import { Panel } from "~/components";

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

  console.log(data);
  return (
    <Panel left="320px">
      <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
        <h1 className="text-xl font-semibold">
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
          <div className="flex items-center gap-3 text-sm text-neutral-400">
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
                <p>
                  {data.basicInfo.openHour.realtime.open === "N"
                    ? "영업마감"
                    : "영업중"}
                </p>
                {data.basicInfo.openHour.periodList[0].timeList.map((v, i) => (
                  <p key={i}>
                    {v.timeSE} {v.dayOfWeek}
                  </p>
                ))}
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
              <p className="break-keep">
                {data.basicInfo.address.region.fullname}{" "}
                {data.basicInfo.address.addrbunho}{" "}
                {data.basicInfo.address.addrdetail}
              </p>
            </li>
            {/* <li className="flex items-start gap-3">
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
            </li> */}
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
              <details className="w-full cursor-pointer outline-none">
                <summary>메뉴 상세보기</summary>
                <ul>
                  {data.menuInfo.menuList.map((v, i) => (
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
                  {/* <li className="border-b-[1px] border-neutral-100 py-2">
                    <div className="h-20 w-2/3 overflow-hidden rounded bg-neutral-100"></div>
                    <div className="mt-2 space-y-1">
                      <p className="font-semibold">카페라떼</p>
                      <p className="text-sm">5,500원</p>
                    </div>
                  </li> */}
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
            {/* <div className="mt-2 rounded bg-neutral-100 px-3 py-2">
              <p>
                t is a long established fact that a reader will be distracted by
                the readable content of a page when looking at its layout. The
                point of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using Content here,
                content here, making it look like readable English. Many desktop
                publishing packages and web page editors now use Lorem Ipsum as
                their default model text, and a search for lorem ipsum will
                uncover many web sites still in their infancy. Various versions
                have evolved over the years, sometimes by accident, sometimes on
                purpose (injected humour and the like).
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
            </div> */}
          </div>
        </div>
      </div>
    </Panel>
  );
}
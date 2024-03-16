import { ICafeResponse } from "~/shared/types";

interface ICard {
  data: ICafeResponse;
}

export function Card({ data }: ICard) {
  return (
    <div className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{data.place_name}</h3>
          <div>
            <button className="mr-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="w-2/3">
            <p className="break-keep text-sm">{data.address_name}</p>
            <p className="text-sm">{data.phone}</p>
            {/* <div className="mt-2 box-border w-full rounded bg-neutral-100 px-2 py-1">
              <p className="text-interaction font-semibold">메뉴</p>
              <p className="mt-1 line-clamp-1 text-sm">
                소금빵 2000 | 크로아상 1000
              </p>
            </div> */}
          </div>
          {/* <div className="w-1/3 self-stretch overflow-hidden rounded bg-neutral-100">
            이미지
          </div> */}
        </div>
        <div className="mt-4 box-border rounded bg-neutral-100 px-2 py-1">
          <p className="text-interaction font-semibold">나의 후기</p>
          <p className="mt-1 line-clamp-3 text-sm">
            디저트도 맛있고 인테리어도 예뻤어요
          </p>
        </div>
      </div>
    </div>
  );
}

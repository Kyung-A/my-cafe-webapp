import { ICafeResponse, IRegister } from "~/shared/types";

import visited from "~/assets/visited.svg";
import unvisited from "~/assets/unvisited.svg";

interface ICard {
  data: ICafeResponse;
  user: IRegister | null;
}

export function Card({ data, user }: ICard) {
  return (
    <div className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]">
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{data.place_name}</h3>
          <div className="shrink-0 pt-1">
            {user && (
              <button className="mr-1 w-[18px]">
                {data.visited ? (
                  <img
                    src={visited}
                    className="fill-interaction w-full"
                    alt="방문함"
                  />
                ) : (
                  <img src={unvisited} className="w-full" alt="방문하지 못함" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="w-2/3">
            <p className="break-keep text-sm">{data.address_name}</p>
            <p className="text-sm">{data.phone}</p>
          </div>
        </div>
        {data.review && (
          <div className="mt-4 box-border rounded bg-neutral-100 px-2 py-1">
            <p className="text-interaction font-semibold">나의 후기</p>
            <p className="mt-1 line-clamp-3 text-sm">{data.review}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";

import { Panel } from "~/components";
import { getReviewList } from "~/.server/review";

interface IParams {
  params: {
    userId: string;
  };
}

export async function loader({ params }: IParams) {
  const { userId } = params;
  const result = await getReviewList(userId);
  return json(result);
}

export default function UserDetailRoute() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <Panel left="320px">
      <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
        <h1 className="text-xl font-semibold">{location.state.name}님</h1>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pb-20 pt-6">
          {data?.map((v) => (
            <Link
              key={v.id}
              to={`/search/review/${v.id}`}
              state={{ prevUrl: location.pathname }}
              className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]"
            >
              <div className="bg-trueGray-100 h-24 w-full overflow-hidden">
                {/* 이미지 */}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1">
                  <h3 className="line-clamp-1 text-lg font-semibold">
                    {v.name}
                  </h3>
                  <div className="shrink-0 text-xs">
                    <span className="text-primary">★ </span>
                    <span className="text-trueGray-400">{v.starRating}.0</span>
                  </div>
                </div>
                <div className="mt-2 box-border rounded bg-neutral-100 px-2 py-2">
                  <p className="line-clamp-3 text-sm">{v.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Panel>
  );
}

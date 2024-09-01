/* eslint-disable @typescript-eslint/no-explicit-any */
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";

import { Panel } from "~/shared/ui";
import { getReviewList } from "~/.server/review";
import { IRegister } from "~/shared/types";

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
  const { user } = useOutletContext<{ user: IRegister }>();

  return (
    <Panel left="320px">
      <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
        <h1 className="text-xl font-semibold">{location.state.name}님</h1>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pb-20 pt-6">
          {data ? (
            data?.map((v) => (
              <Link
                key={v.id}
                to={`/search/review/${v.id}`}
                state={{ prevUrl: location.pathname, myId: user.id }}
                className="cursor-pointer overflow-hidden rounded-md shadow-[0px_0px_10px_-2px_#4343432e]"
              >
                {v.reviewImages && (
                  <div className="h-24 w-full overflow-hidden">
                    <img
                      src={v.reviewImages?.split(",")[0]}
                      alt="미리보기"
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    <h3 className="line-clamp-1 text-lg font-semibold">
                      {v.name}
                    </h3>
                    <div className="shrink-0 text-xs">
                      <span className="text-primary">★ </span>
                      <span className="text-trueGray-400">
                        {v.starRating}.0
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 box-border rounded bg-neutral-100 px-2 py-2">
                    <p className="line-clamp-3 text-sm">{v.description}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="pt-60 text-center">작성된 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </Panel>
  );
}

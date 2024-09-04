import { useEffect, useMemo, useState } from "react";
import {
  Link,
  json,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { getReview } from "~/.server/review";
import { Panel } from "~/shared/ui";
import { getSingleMarker } from "~/entities/search/model/getSingleMarker";
import { useMap } from "~/providers/Map";
import { IMarker } from "~/entities/search/types";
import { removeSingleMarker } from "~/entities/search";
import { ImageSlider } from "~/shared/ui/ImageSlider";
import { ReviewContent } from "~/widgets/review/ReviewContent.ui";
import { IProfile } from "~/entities/user/types";
import { LikeForm } from "~/features/review/like";
import { reivewLiked } from "~/entities/review";

interface IParams {
  params: {
    reviewId: string;
  };
}

export async function loader({ params }: IParams) {
  const { reviewId } = params;
  const result = await getReview(reviewId);
  return json(result);
}

export async function action({ request }: ActionFunctionArgs) {
  await reivewLiked(request);
  return null;
}

export default function ReviewDetailRoute() {
  const data = useLoaderData<typeof loader>();
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext<{ user: IProfile }>();
  const { mapData } = useMap();

  const [marker, setMarker] = useState<IMarker | null>(null);

  const hasPrevUrl = useMemo(
    () => location.state?.prevUrl && location.state.prevUrl.includes("/users"),
    [location.state.prevUrl]
  );

  useEffect(() => {
    if (data && hasPrevUrl) {
      const marker = getSingleMarker(mapData, {
        x: data.x,
        y: data.y,
        name: data.name,
      });
      marker.setMap(mapData);
    }
  }, [data, mapData, hasPrevUrl]);

  return (
    <Panel left={`${hasPrevUrl ? "0px" : "320px"}`}>
      <div className="relative h-full w-full">
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
          <Link
            to={`/search/${data?.cafeId}`}
            state={{
              x: data?.x,
              y: data?.y,
              review: data?.description,
              reviewId: data?.id,
              ...(location.state?.prevUrl && {
                prevUrl: location.state?.prevUrl,
              }),
            }}
            onClick={() => {
              removeSingleMarker(marker, setMarker);
            }}
            className="break-keep text-xl font-semibold leading-6"
          >
            {data?.name}
          </Link>
          {user.id === data?.authorId && (
            <Link
              to="/search/reviewForm"
              state={{
                cafeId: data?.cafeId,
                reviewId: reviewId,
                name: data?.name,
              }}
              className="bg-interaction ml-auto shrink-0 rounded-full px-4 py-1 text-sm font-semibold"
            >
              수정
            </Link>
          )}
        </div>
        <div className="h-full w-full overflow-y-auto">
          {data?.reviewImages && (
            <ImageSlider data={data?.reviewImages?.split(",")} />
          )}
          <div className="flex flex-col gap-10 px-4 pb-20 pt-6">
            <div>
              <p className="text-lg font-semibold">☕ 후기</p>
              <p className="mt-2 rounded bg-neutral-100 px-3 py-2">
                {data?.description}
              </p>
            </div>
            <ReviewContent title="👍 장점" data={data?.good.split(",")} />
            <ReviewContent title="👎 단점" data={data?.notGood.split(",")} />
            <ReviewContent title="💛 추천메뉴" data={data?.recommend} />
            <ReviewContent title="⭐ 별점" data={String(data?.starRating)} />
          </div>
        </div>
        {hasPrevUrl && data && location.state && (
          <LikeForm
            data={{
              isLiked: String(
                data?.likedBy.some((v) => v.id === location.state.myId)
              ),
              reviewId: data.id,
              userId: location.state.myId,
              count: data.likedBy.length,
              likedBy: data.likedBy,
            }}
          />
        )}
      </div>
    </Panel>
  );
}

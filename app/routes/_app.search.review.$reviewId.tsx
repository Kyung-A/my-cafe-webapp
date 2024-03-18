import { Link, json, useLoaderData, useParams } from "@remix-run/react";
import { getReview } from "~/.server/review";
import { Panel } from "~/components";

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

export default function ReviewDetailRoute() {
  const { reviewId } = useParams();
  const data = useLoaderData<typeof loader>();

  return (
    <Panel left="320px">
      <div className="bg-primary flex w-full items-center justify-between px-4 py-3">
        <h1 className="break-keep text-xl font-semibold leading-6">
          {data?.name}
        </h1>
        <Link
          to="/search/reviewForm"
          state={{
            cafeId: data?.cafeId,
            reviewId: reviewId,
            name: data?.name,
            booking: false,
          }}
          className="bg-interaction shrink-0 rounded-full px-4 py-1 text-sm font-semibold "
        >
          수정
        </Link>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
          <div>
            <p className="text-lg font-semibold">☕ 후기</p>
            <p className="mt-2 rounded bg-neutral-100 px-3 py-2">
              {data?.description}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">👍 장점</p>
            <ul className="list-inside list-disc px-3 py-2">
              {data?.good.split(",").map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">👎 단점</p>
            <ul className="list-inside list-disc px-3 py-2">
              {data?.notGood.split(",").map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">💛 추천메뉴</p>
            <p className="px-3 py-2">{data?.recommend}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">🏷️ 태그</p>
            <p className="px-3 py-2">{data?.tags}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">⭐ 별점</p>
            <p className="px-3 py-2">{data?.starRating} / 5</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

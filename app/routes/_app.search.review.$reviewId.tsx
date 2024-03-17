import { json, useLoaderData } from "@remix-run/react";
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
  return json({ result });
}

export default function ReviewDetailRoute() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <Panel left="320px">
      <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
        <h1 className="text-xl font-semibold">XX식당</h1>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
          <div>
            <p className="text-lg font-semibold">☕ 후기</p>
            <p className="mt-2 rounded bg-neutral-100 px-3 py-2">
              {data.result?.description}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">👍 장점</p>
            <ul className="list-inside list-disc px-3 py-2">
              {data.result?.good.split(",").map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">👎 단점</p>
            <ul className="list-inside list-disc px-3 py-2">
              {data.result?.notGood
                .split(",")
                .map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold">💛 추천메뉴</p>
            <p className="px-3 py-2">{data.result?.recommend}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">🏷️ 태그</p>
            <p className="px-3 py-2">{data.result?.tags}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">⭐ 별점</p>
            <p className="px-3 py-2">{data.result?.starRating} / 5</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

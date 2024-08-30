import {
  Form,
  Link,
  json,
  useLoaderData,
  useLocation,
  // useNavigate,
  useParams,
} from "@remix-run/react";
import Slider from "react-slick";

import {
  createReviewLike,
  getReview,
  removeReviewLike,
} from "~/.server/review";
// import { useMoveTheMap } from "~/hooks";
import { ActionFunctionArgs } from "@remix-run/node";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

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
  const formData = await request.formData();
  const isLiked = String(formData.get("isLiked"));
  const reviewId = String(formData.get("reviewId"));
  const userId = String(formData.get("userId"));

  if (isLiked === "true") {
    await removeReviewLike({ reviewId, userId });
  } else {
    await createReviewLike({ reviewId, userId });
  }
  return null;
}

export default function MobileReviewDetailRoute() {
  const data = useLoaderData<typeof loader>();
  const { reviewId } = useParams();
  const location = useLocation();

  const sliderInit = {
    dots: false,
    Infinity: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="absolute z-10 h-[calc(100vh-80px)] w-full bg-white">
      <div className="relative h-full w-full">
        <div
          className={`bg-primary flex w-full items-center gap-x-2 px-4 py-3`}
        >
          <Link
            to="/m/search"
            state={{
              cafeId: location.state?.cafeId,
              name: location.state?.name,
              x: location.state?.x,
              y: location.state?.y,
              reviewId: reviewId,
              review: data?.description,
            }}
            className="w-6"
          >
            <ChevronLeftIcon className="w-full" />
          </Link>
          {location.state?.prevUrl &&
          location.state?.prevUrl.includes("/users") ? (
            <p
              // to={`/search/${data?.cafeId}`}
              // state={{
              //   x: data?.x,
              //   y: data?.y,
              //   review: data?.description,
              //   reviewId: data?.id,
              //   ...(location.state?.prevUrl && {
              //     prevUrl: location.state?.prevUrl,
              //   }),
              // }}
              // onClick={() => {
              //   marker?.setMap(null);
              //   setMarker(null);
              // }}
              className="break-keep text-xl font-semibold leading-6"
            >
              {data?.name}
            </p>
          ) : (
            <h1 className="break-keep text-xl font-semibold leading-6">
              {data?.name}
            </h1>
          )}
          <Link
            to="/m/reviewForm"
            state={{
              cafeId: data?.cafeId,
              reviewId: reviewId,
              name: data?.name,
            }}
            className="bg-interaction ml-auto shrink-0 rounded-full px-4 py-1 text-sm font-semibold"
          >
            수정
          </Link>
        </div>
        <div className="h-[calc(100vh-132px)] w-full overflow-y-auto">
          {data?.reviewImages && (
            <div className="slider-container max-h-[208px] overflow-hidden">
              <Slider {...sliderInit}>
                {data?.reviewImages?.split(",").map((src) => (
                  <div key={src} className="h-full w-full">
                    <input
                      type="image"
                      src={src}
                      className="top-1/4 aspect-square w-full -translate-y-1/4 object-cover"
                      alt="이미지"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
          <div className="flex flex-col gap-12 px-4 py-6">
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
        {location.state?.prevUrl &&
          location.state?.prevUrl.includes("/users") && (
            <Form method="post" navigate={false}>
              <input
                name="isLiked"
                type="text"
                value={String(
                  data?.likedBy.some((v) => v.id === location.state?.myId)
                )}
                hidden
                readOnly
              />
              <input
                name="reviewId"
                type="text"
                value={data?.id}
                hidden
                readOnly
              />
              <input
                name="userId"
                type="text"
                value={location.state?.myId}
                hidden
                readOnly
              />
              <button
                type="submit"
                className={`absolute bottom-6 right-4 flex h-12 w-12 flex-col items-center justify-center rounded-full shadow-md ${data?.likedBy.some((v) => v.id === location.state?.myId) ? "text-red-500" : ""}`}
              >
                <span className="text-xl">❤</span>
                <span className="-mt-1 text-xs">{data?.likedBy.length}</span>
              </button>
            </Form>
          )}
      </div>
    </div>
  );
}

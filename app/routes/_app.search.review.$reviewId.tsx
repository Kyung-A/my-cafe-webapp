import {
  Link,
  json,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";

import arrowLeft from "~/assets/arrowLeft.svg";
import { getReview } from "~/.server/review";
import { Panel } from "~/components";
import { useEffect, useState } from "react";
import { useMap } from "~/shared/contexts/Map";
import { IMarker } from "~/shared/types";

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
  const data = useLoaderData<typeof loader>();
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { mapData } = useMap();
  const [marker, setMarker] = useState<IMarker | null>(null);

  useEffect(() => {
    if (
      location.state?.prevUrl &&
      location.state.prevUrl.includes("/ranking")
    ) {
      const { kakao } = window;
      if (!kakao || !mapData) return;

      const position = new kakao.maps.LatLng(data?.y, data?.x);
      const marker = new kakao.maps.Marker({
        position: position,
        title: data?.name,
        zIndex: 30,
      });
      setMarker(marker);
      mapData.setCenter(position);
    }
  }, [data, location, mapData]);

  useEffect(() => {
    if (!mapData) return;
    if (marker) {
      marker?.setMap(mapData);
    }
  }, [marker, mapData]);

  return (
    <Panel
      left={`${location.state?.prevUrl && location.state.prevUrl.includes("/ranking") ? "0px" : "320px"}`}
    >
      <div
        className={`bg-primary flex w-full items-center px-4 py-3 ${location.state?.prevUrl && location.state?.prevUrl.includes("/ranking") ? "gap-2" : "justify-between "}`}
      >
        {location.state?.prevUrl &&
          location.state?.prevUrl.includes("/ranking") && (
            <button
              onClick={() => {
                navigate(-1);
                marker?.setMap(null);
                setMarker(null);
              }}
              className="w-6"
            >
              <img src={arrowLeft} alt="이전" />
            </button>
          )}
        <h1 className="break-keep text-xl font-semibold leading-6">
          {data?.name}
        </h1>
        {location.state?.prevUrl &&
          !location.state?.prevUrl.includes("/ranking") && (
            <Link
              to="/search/reviewForm"
              state={{
                cafeId: data?.cafeId,
                reviewId: reviewId,
                name: data?.name,
              }}
              className="bg-interaction shrink-0 rounded-full px-4 py-1 text-sm font-semibold "
            >
              수정
            </Link>
          )}
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="bg-trueGray-100 h-40 w-full">{/* 이미지 */}</div>
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

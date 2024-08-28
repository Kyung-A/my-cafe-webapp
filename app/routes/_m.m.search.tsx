import { json, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUser } from "~/.server/storage";
import { Card } from "~/components";
import { useMap } from "~/shared/contexts/Map";
import { ICafeResponse, ICoord } from "~/shared/types";

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json(user);
}

export default function MobileCafeSearchRoute() {
  const user = useLoaderData<typeof loader>();
  const [coordinate, setCoordinate] = useState<ICoord | null>();

  const { cafeData, pagination } = useMap();

  useEffect(() => {
    if (pagination?.hasNextPage) {
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  return (
    <main className="mt-6 px-6">
      {!pagination?.hasNextPage && cafeData.current.length > 0 && (
        <div className="mt-2 flex flex-col gap-6">
          {cafeData.current.map((v: ICafeResponse) => {
            const directions = location.pathname.includes("directions");

            return directions ? (
              <div
                key={v.id}
                onClick={() =>
                  setCoordinate({
                    name: v.place_name,
                    x: v.x,
                    y: v.y,
                  })
                }
                aria-hidden="true"
              >
                <Card data={v} user={user} />
              </div>
            ) : (
              <Link
                to={v.x && v.y && v.id}
                key={v.id}
                state={{
                  x: v.x,
                  y: v.y,
                  review: v.review,
                  reviewId: v.reviewId,
                }}
              >
                <Card data={v} user={user} />
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

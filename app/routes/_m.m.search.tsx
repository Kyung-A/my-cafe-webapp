import { json, Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUser } from "~/.server/storage";
import { Card } from "~/components";
import { useMap } from "~/shared/contexts/Map";
import { ICafeResponse, ICoord } from "~/shared/types";

interface IOutletContext {
  address: string;
  isActiveMenu: { id: string; name: string; active: boolean };
  keyword: string;
}

export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) return null;
  return json(user);
}

export default function MobileCafeSearchRoute() {
  const user = useLoaderData<typeof loader>();
  const { address, isActiveMenu, keyword } = useOutletContext<IOutletContext>();
  const [coordinate, setCoordinate] = useState<ICoord | null>();

  const { cafeData, pagination } = useMap();

  useEffect(() => {
    if (pagination?.hasNextPage) {
      pagination?.gotoPage(pagination.current + 1);
    }
  }, [pagination]);

  return (
    <>
      <div className="px-6">
        <h2 className="text-md font-semibold leading-6">
          {address} 주변 <br />
        </h2>
        <h3 className="text-interaction text-xl font-semibold">
          {isActiveMenu.id === "search"
            ? `${keyword} ${isActiveMenu.name}`
            : isActiveMenu.name}
        </h3>
      </div>
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-6">
        {!pagination?.hasNextPage && cafeData.current.length > 0 && (
          <div className="mt-4 flex flex-col gap-6 pb-28">
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
      </div>
    </>
  );
}

import { MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { getReviewList } from "~/.server/review";
import { getUser } from "~/.server/storage";
import { Header, BottomSheet } from "~/components/mobile";
import { useClickActive } from "~/hooks";

import { useMap } from "~/shared/contexts/Map";
import { IRegister, IReview } from "~/shared/types";

export const meta: MetaFunction = () => {
  return [{ title: "myCafe" }];
};

export async function loader({ request }: { request: Request }) {
  const user: IRegister | null = await getUser(request);
  if (!user?.id) return null;

  const result = await getReviewList(user?.id);
  return json(result);
}

export default function MobileMainLayoutRoute() {
  const userReview = useLoaderData<typeof loader>();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { handleMenu } = useClickActive();
  const { mapEl, GNB, mapData } = useMap();

  const isActiveMenu = useMemo(() => GNB.find((v) => v.active), [GNB]);
  const handleHeader = useCallback(
    (type: string) => {
      const isActive = GNB.some((v) => v.id === type && v.active === true);
      if (isActive) return;
      handleMenu(type, userReview as IReview[]);
    },
    [userReview, mapData, GNB]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={mapEl}
      id="map"
      onMouseUp={handleTouchEnd}
      className="relative mx-auto h-screen w-full max-w-[480px] overflow-hidden"
    >
      {isActiveMenu && (
        <BottomSheet isDragging={isDragging} setIsDragging={setIsDragging}>
          <Outlet />
        </BottomSheet>
      )}
      <Header handleHeader={handleHeader} />
    </div>
  );
}

import { useLocation } from "@remix-run/react";

import { MapPinIcon, TrophyIcon, UsersIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface IHeader {
  handleHeader: (type: string) => void;
}

export function Header({ handleHeader }: IHeader) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 z-50 box-border h-20 w-full max-w-[480px] bg-white px-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <ul className="flex h-full w-full items-center justify-between gap-2">
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <button onClick={() => handleHeader("default")} type="button">
            <MapPinIcon
              className={`w-7 fill-none ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
            />
            <span
              className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
            >
              주변
            </span>
          </button>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <button type="button">
            <TrophyIcon
              className={`w-7 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
            />
            <span
              className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
            >
              리뷰어
            </span>
          </button>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <UsersIcon
            className={`w-7 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
          />
          <span
            className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
          >
            팔로잉
          </span>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <UserCircleIcon
            className={`w-7 fill-none ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
          />

          <span
            className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
          >
            MY
          </span>
        </li>
      </ul>
    </nav>
  );
}

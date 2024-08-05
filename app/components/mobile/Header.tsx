import { useLocation } from "@remix-run/react";
import Pin from "~/assets/pin";
import Trophy from "~/assets/trophy";
import UserIcon from "~/assets/user";
import Users from "~/assets/users";

export function Header() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 z-50 box-border h-20 w-full max-w-[480px] bg-white px-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]">
      <ul className="flex h-full w-full items-center justify-between gap-2">
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <Pin
            className={`w-7 fill-none stroke-neutral-800 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
          />
          <span
            className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
          >
            주변
          </span>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <Trophy
            className={`w-7 stroke-neutral-800 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
          />
          <span
            className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
          >
            리뷰어
          </span>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <Users
            className={`w-7 stroke-neutral-800 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
          />
          <span
            className={`text-center text-sm ${location.pathname.includes("/m") ? "text-interaction font-semibold" : "text-neutral-800"}`}
          >
            팔로잉
          </span>
        </li>
        <li className="flex h-full flex-col items-center justify-center gap-1 px-6">
          <UserIcon
            className={`w-7 fill-none stroke-neutral-800 ${location.pathname.includes("/m") ? "stroke-interaction" : "stroke-neutral-800"}`}
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

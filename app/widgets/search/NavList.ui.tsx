import { Link } from "@remix-run/react";
import { Menu } from "~/shared/ui";

interface INavList {
  address: string;
  user: boolean;
  handleFetch: () => void;
}

export function NavList({ address, user, handleFetch }: INavList) {
  return (
    <div className="px-4 pt-6">
      <h2 className="text-lg font-semibold">☕ {address} 주변 탐색</h2>
      <ul className="mt-3 flex flex-col gap-2">
        <li>
          <button
            type="button"
            onClick={handleFetch}
            className="border-primary w-full rounded border px-4 py-2 text-left"
          >
            카페 보기
          </button>
        </li>
        <li>
          <Link
            to="/users?filter=ranking"
            state={{ filter: "ranking" }}
            className="block w-full"
          >
            <Menu name="베스트 리뷰어" />
          </Link>
          {user && (
            <Link
              to="/users?filter=follow"
              state={{ filter: "follow" }}
              className="mt-2 block w-full"
            >
              <Menu name="나의 팔로잉 목록" />
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}

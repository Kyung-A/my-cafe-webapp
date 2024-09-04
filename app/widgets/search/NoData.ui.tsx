import { Link } from "@remix-run/react";

export function NoCafe() {
  return (
    <div className="h-full w-full pt-36">
      <p className="text-center">카페를 찾지 못 했습니다.</p>
    </div>
  );
}

export function NoUser() {
  return (
    <div className="flex h-full w-full flex-col items-center pt-36">
      <p className="text-center">로그인이 필요한 서비스입니다.</p>
      <Link
        to="/signin"
        className="bg-interaction mx-auto mt-3 inline-block rounded-full px-8 py-2 text-center text-sm font-semibold text-white"
      >
        로그인 하기
      </Link>
    </div>
  );
}

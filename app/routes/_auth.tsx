import { Outlet } from "@remix-run/react";

export default function AuthLayoutRoute() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F2CA50]">
      <div className="w-96 rounded-lg bg-white px-6 py-8 shadow-[0px_0px_20px_0px_#f29f0591]">
        <Outlet />
      </div>
    </div>
  );
}

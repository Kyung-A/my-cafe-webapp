import { Outlet } from "@remix-run/react";

export default function AuthLayoutRoute() {
  return (
    <div className="fixed z-50 h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#F2CA50]">
        <div className="w-96 rounded-lg bg-white px-6 py-8 shadow-[0px_0px_20px_0px_#f29f0591]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

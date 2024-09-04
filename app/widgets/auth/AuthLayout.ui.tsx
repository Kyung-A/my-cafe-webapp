import { Link } from "@remix-run/react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed z-50 h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#F2CA50]">
        <div className="flex w-96 flex-col items-center rounded-lg bg-white px-6 py-8 shadow-[0px_0px_20px_0px_#f29f0591]">
          <Link to="/" className="text-xl font-semibold">
            ☕ myCafe
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

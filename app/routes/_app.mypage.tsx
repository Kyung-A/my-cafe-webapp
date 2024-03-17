import { Outlet, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";

import { Card } from "~/components";
import { mypageGnb } from "~/shared/consts/tabs";
import { IRegister } from "~/shared/types";

export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user: IRegister }>();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [navigate, user]);

  return (
    <div>
      <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
        <ul className="flex items-center justify-between">
          {mypageGnb.map((v) => (
            <li key={v.id}>
              <button
                className={`block w-full rounded-full px-4 py-1 text-center text-sm ${v.active ? "bg-interaction font-semibold text-white" : ""}`}
              >
                {v.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 px-4">{/* <Card /> */}</div>
      <Outlet />
    </div>
  );
}

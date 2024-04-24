import { json, useLoaderData, useNavigate } from "@remix-run/react";

import { getUsers } from "~/.server/users";
import bar3 from "~/assets/bar3.svg";

export async function loader() {
  const result = await getUsers();
  return json(result);
}

export default function RankingRoute() {
  const users = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-primary w-full px-4 py-4">
        <div className="flex items-center gap-2 text-white">
          <button
            onClick={() => {
              navigate("/search");
            }}
          >
            <img src={bar3} alt="gnb" className="w-5" />
          </button>
          <h1>myCafe</h1>
        </div>
      </div>
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold">
          ☕ <span className="text-interaction">TOP 10</span> 베스트 리뷰어
        </h2>
      </div>
      <div className="h-screen w-full overflow-y-auto px-4 pb-[220px]">
        <ul className="mt-2 flex flex-col gap-6">
          {users?.map((v, i) => (
            <li
              key={v.id}
              className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]"
            >
              <div className="p-4">
                <div className="bg-primary flex h-5 w-5 flex-col items-center justify-center rounded-full text-xs font-semibold text-white">
                  {i + 1}
                </div>
                <div className="flex items-center">
                  <div>
                    <h3 className="mt-1 text-lg font-semibold">{v.name}</h3>
                    <div className="flex items-center">
                      <div className="text-trueGray-400 text-sm">
                        리뷰수 {v._count.review}
                      </div>
                      <hr className="divide-y-1 border-trueGray-300 mx-1 h-[1px] w-3 rotate-90" />
                      <div className="text-trueGray-400 text-sm ">
                        팔로워 {v._count.follower}
                      </div>
                    </div>
                  </div>
                  <button className="text-interaction ml-auto rounded bg-[rgb(255_243_221)] px-3 py-1 text-sm font-semibold">
                    팔로우
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

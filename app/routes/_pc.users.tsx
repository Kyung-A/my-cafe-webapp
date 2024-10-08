import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { createFollow, getFollowings } from "~/.server/follow";
import { getUser } from "~/.server/storage";
import { getUsers } from "~/.server/users";
import { IRegister } from "~/shared/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");

  const user: IRegister | null = await getUser(request);

  if (filter === "ranking") {
    const result = await getUsers();

    if (!user?.id) {
      return json({ users: result, followings: null });
    } else {
      const followings = await getFollowings(user.id);
      return json({ users: result, followings: followings });
    }
  }

  if (filter === "follow" && user?.id) {
    const result = await getUsers(user.id);
    return json({ users: result, followings: null });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const followingId = String(formData.get("followingId"));
  const followerId = String(formData.get("followerId"));

  const result = await createFollow({ followingId, followerId });
  return json(result);
}

export default function RankingRoute() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();

  const data = useLoaderData<typeof loader>();
  const { user } = useOutletContext<{ user: IRegister }>();

  return (
    <>
      <div className="bg-primary w-full px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <button
            onClick={() => {
              navigate("/search");
            }}
          >
            <Bars3Icon className="w-5" />
          </button>
          <h1>myCafe</h1>
        </div>
      </div>
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold">
          {location.search.includes("ranking") ? (
            <>
              ☕ <span className="text-interaction">TOP 10</span> 베스트 리뷰어
            </>
          ) : (
            "👀 내가 팔로잉한 유저"
          )}
        </h2>
      </div>
      <div className="h-screen w-full overflow-y-auto px-4 pb-[150px]">
        <div className="mt-2 flex flex-col gap-6">
          {data?.users && data?.users?.length > 0 ? (
            data?.users?.map((v) => (
              <Link
                key={v.id}
                to={{
                  pathname: v.id,
                  search: location.search,
                }}
                state={{
                  name: v.name,
                }}
                className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]"
              >
                <div className="p-4">
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      {v.profile ? (
                        <img
                          src={v.profile}
                          alt="프로필 이미지"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-full fill-neutral-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{v.name}</h3>
                      <div className="flex items-center">
                        <div className="text-trueGray-400 text-sm">
                          리뷰수 {v._count.review}
                        </div>
                        <hr className="divide-y-1 border-trueGray-300 mx-1 h-[1px] w-3 rotate-90" />
                        <div className="text-trueGray-400 text-sm ">
                          팔로워 {v._count.followers}
                        </div>
                      </div>
                    </div>
                    {location.state.filter === "ranking" &&
                      (user ? (
                        v.id !== user.id && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              submit(
                                {
                                  followingId: v.id,
                                  followerId: user.id ?? null,
                                },
                                { method: "post", navigate: false }
                              );
                            }}
                            className={`ml-auto rounded px-3 py-1 text-sm font-semibold ${
                              !data?.followings ||
                              data?.followings?.some((id) => v.id === id)
                                ? "bg-trueGray-100 text-trueGray-400"
                                : "text-interaction bg-[rgb(255_243_221)]"
                            }`}
                          >
                            {!data?.followings ||
                            data?.followings?.some((id) => v.id === id)
                              ? "팔로잉"
                              : "팔로우"}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/signin");
                          }}
                          className="text-interaction ml-auto rounded bg-[rgb(255_243_221)] px-3 py-1 text-sm font-semibold"
                        >
                          팔로우
                        </button>
                      ))}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="pt-40 text-center">팔로잉한 유저가 없습니다.</div>
          )}
        </div>
      </div>
      <Outlet context={{ user }} />
    </>
  );
}

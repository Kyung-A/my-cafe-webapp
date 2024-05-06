import { ActionFunctionArgs } from "@remix-run/node";
import {
  Link,
  Outlet,
  json,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import { createFollow, getFollowings } from "~/.server/follow";
import { getUser } from "~/.server/storage";

import { getUsers } from "~/.server/users";
import { IRegister } from "~/shared/types";
import userImg from "~/assets/user.svg";
import bar3 from "~/assets/bar3.svg";

export async function loader({ request }: { request: Request }) {
  const user: IRegister | null = await getUser(request);
  const result = await getUsers();

  if (!user?.id) {
    return json({ users: result, followings: null });
  } else {
    const followings = await getFollowings(user.id);
    return json({ users: result, followings: followings });
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
      <div className="h-screen w-full overflow-y-auto px-4 pb-[150px]">
        <div className="mt-2 flex flex-col gap-6">
          {data?.users?.map((v) => (
            <Link
              key={v.id}
              to={`${v.id}`}
              state={{
                name: v.name,
              }}
              className="cursor-pointer rounded-md shadow-[0px_0px_10px_-2px_#4343432e]"
            >
              <div className="p-4">
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <img
                      src={v.profile ?? userImg}
                      alt="프로필 이미지"
                      className="h-full w-full object-cover"
                    />
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
                  {user ? (
                    v.id !== user.id && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          submit(
                            { followingId: v.id, followerId: user.id ?? null },
                            { method: "post" }
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
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}

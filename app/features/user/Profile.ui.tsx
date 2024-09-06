import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { memo } from "react";
import { IProfile } from "~/entities/user/types";

interface IProfileProps {
  user: IProfile | undefined;
  setOpened: (value: React.SetStateAction<boolean>) => void;
}

export const Profile = memo(function Profile({
  user,
  setOpened,
}: IProfileProps) {
  return (
    <div className="mb-2 px-4 pt-6">
      <h2 className="text-lg font-semibold">👋 안녕하세요 {user?.name}님!</h2>
      <div className="relative mt-2 flex w-full items-center">
        <button onClick={() => setOpened(true)}>
          <div className="bg-trueGray-100 absolute bottom-0 left-12 h-5 w-5 rounded-full p-[3px]">
            <PencilSquareIcon />
          </div>
          <div className="h-16 w-16 overflow-hidden rounded-full">
            {user?.profile ? (
              <img
                src={user?.profile}
                alt="프로필 이미지"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-full fill-neutral-300" />
            )}
          </div>
        </button>
        <div className="flex-1">
          <p className="break-keep pl-3 text-sm">{user?.email}</p>
          <table className="mt-1 w-full text-left text-xs">
            <tbody>
              <tr>
                <th className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                  리뷰수
                </th>
                <th className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                  팔로워
                </th>
                <th className="text-trueGray-500 w-1/3 px-3 font-normal">
                  팔로잉
                </th>
              </tr>
              <tr>
                <td className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                  {user?._count?.review}
                </td>
                <td className="text-trueGray-500 w-1/3 border-r px-3 font-normal">
                  {user?._count?.followers}
                </td>
                <td className="text-trueGray-500 w-1/3 px-3 font-normal">
                  {user?._count?.following}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

import { Card } from "~/components";
import { MapLayout, Panel } from "~/layouts";
import { mypageGnb } from "~/shared/tabs";

const MyPage = () => {
  return (
    <MapLayout>
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
      <div className="mt-6 px-4">
        <Card />
      </div>
      <Panel left="320px">
        <div className="bg-primary flex h-12 w-full flex-col justify-center px-4">
          <h1 className="text-xl font-semibold">XX식당</h1>
        </div>
        <div className="h-full w-full overflow-y-auto">
          <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
            <div>
              <p className="text-lg font-semibold">☕ 후기</p>
              <p className="mt-2 rounded bg-neutral-100 px-3 py-2">
                t is a long established fact that a reader will be distracted by
                the readable content of a page when looking at its layout. The
                point of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using Content here,
                content here, making it look like readable English. Many desktop
                publishing packages and web page editors now use Lorem Ipsum as
                their default model text, and a search for lorem ipsum will
                uncover many web sites still in their infancy. Various versions
                have evolved over the years, sometimes by accident, sometimes on
                purpose (injected humour and the like).
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">👍 장점</p>
              <ul className="list-inside list-disc px-3 py-2">
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
              </ul>
            </div>
            <div>
              <p className="text-lg font-semibold">👎 단점</p>
              <ul className="list-inside list-disc px-3 py-2">
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
                <li>
                  t is a long established fact that a reader will be distracted
                  by
                </li>
              </ul>
            </div>
            <div>
              <p className="text-lg font-semibold">💛 추천메뉴</p>
              <p className="px-3 py-2">소금빵, 카페라떼</p>
            </div>
            <div>
              <p className="text-lg font-semibold">🏷️ 태그</p>
              <p className="px-3 py-2">인스타감성, 조용함</p>
            </div>
            <div>
              <p className="text-lg font-semibold">⭐ 별점</p>
              <p className="px-3 py-2">2.5 / 5</p>
            </div>
          </div>
        </div>
      </Panel>
    </MapLayout>
  );
};

export default MyPage;

import { Panel } from "~/components";

export default function CafeReviewCreateRoute() {
  return (
    <Panel left="320px">
      <div className="bg-primary flex h-12 w-full items-center justify-between px-4">
        <h1 className="text-xl font-semibold">XX식당 후기 등록</h1>
        <button className="bg-interaction rounded-full px-4 py-1 font-semibold">
          저장
        </button>
      </div>
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
          <div>
            <p className="text-lg font-semibold">☕ 후기</p>
            <textarea
              placeholder="후기를 자유롭게 작성해주세요."
              className="mt-2 h-24 w-full resize-none rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
            ></textarea>
          </div>
          <div>
            <p className="text-lg font-semibold">👍 장점</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between overflow-hidden rounded border border-neutral-300">
                <input
                  type="text"
                  className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                  placeholder="장점을 입력해주세요."
                />
                <button className="pr-2 text-neutral-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
              </div>
              <button className="bg-interaction mt-4 rounded-full px-4 py-1 text-sm font-semibold text-white">
                추가
              </button>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">👎 단점</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between overflow-hidden rounded border border-neutral-300">
                <input
                  type="text"
                  className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                  placeholder="단점을 입력해주세요."
                />
                <button className="pr-2 text-neutral-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    />
                  </svg>
                </button>
              </div>
              <button className="bg-interaction mt-4 rounded-full px-4 py-1 text-sm font-semibold text-white">
                추가
              </button>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">💛 추천메뉴</p>
            <input
              type="text"
              className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
              placeholder="추천메뉴를 입력해주세요."
            />
          </div>
          <div>
            <p className="text-lg font-semibold">🏷️ 태그</p>
            <input
              type="text"
              className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
              placeholder="태그를 입력해주세요."
            />
          </div>
          <div>
            <p className="text-lg font-semibold">⭐ 별점</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                max={5}
                min={0}
                defaultValue={0}
                step={0.5}
                className="w-20 rounded border border-neutral-300 px-3 py-1 outline-none placeholder:text-neutral-300"
                placeholder="별점"
              />
              <p className="text-lg">/ 5</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

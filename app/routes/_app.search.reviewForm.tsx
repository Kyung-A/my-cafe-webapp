/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useFetcher, useLocation } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

import { getReview, createReview, updateReview } from "~/.server/review";
import { getUser } from "~/.server/storage";
import { Panel } from "~/components";
import { IFieldInput, IReview } from "~/shared/types";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const reviewId = url.searchParams.get("reviewId");
  if (reviewId) {
    const result = await getReview(reviewId);
    return json(result);
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getUser(request);
  const reviewId = String(formData.get("reviewId"));

  if (!user) {
    return redirect("/signin");
  } else {
    const data: any = {};

    const goodArr: FormDataEntryValue[] = [];
    const notGoodArr: FormDataEntryValue[] = [];

    [...formData.entries()].forEach(([key, value]) => {
      if (key === "reviewId") return;

      if (key === "good") {
        goodArr.push(value);
        data[key] = goodArr.join(",");
      } else if (key === "notGood") {
        notGoodArr.push(value);
        data[key] = notGoodArr.join(",");
      } else if (key === "starRating") {
        data[key] = Number(value);
      } else if (key === "booking") {
        data[key] = Boolean(value);
      } else {
        data[key] = value;
      }
    });

    data["userId"] = user.id;
    data["visited"] = true;

    if (reviewId) {
      data["id"] = reviewId;

      const id = await updateReview(data as IReview);
      return redirect(`/search/review/${id}`);
    } else {
      const id = await createReview(data as IReview);
      return redirect(`/search/review/${id}`);
    }
  }
}

export default function CafeReviewCreateRoute() {
  const location = useLocation();
  const fetcher = useFetcher<IReview>();

  const [goodInput, setGoodInput] = useState<IFieldInput[]>([
    { id: 0, text: "" },
  ]);
  const [notGoodInput, setNotGoodInput] = useState<IFieldInput[]>([
    { id: 0, text: "" },
  ]);

  const addInput = useCallback(
    (name: string) => {
      if (name === "good") {
        const num = goodInput.length !== 0 ? goodInput.at(-1)?.id : 0;
        setGoodInput([...goodInput, { id: num! + 1, text: "" }]);
      }
      if (name === "notGood") {
        const num = notGoodInput.length !== 0 ? notGoodInput.at(-1)?.id : 0;
        setNotGoodInput([...notGoodInput, { id: num! + 1, text: "" }]);
      }
    },
    [goodInput, notGoodInput]
  );

  const deleteInput = useCallback(
    (name: string, id: number) => {
      if (name === "good") {
        const remove = goodInput.filter((v) => v.id !== id);
        setGoodInput(remove);
      }
      if (name === "notGood") {
        const remove = notGoodInput.filter((v) => v.id !== id);
        setNotGoodInput(remove);
      }
    },
    [goodInput, notGoodInput]
  );

  useEffect(() => {
    if (location.state.reviewId) {
      fetcher.load(`/search/reviewForm?reviewId=${location.state.reviewId}`);
    }
  }, [location.state]);

  useEffect(() => {
    if (fetcher.data) {
      const { good, notGood } = fetcher.data;

      const goodArr = good.split(",").map((v, i) => ({ id: i, text: v }));
      const notGoodArr = notGood.split(",").map((v, i) => ({ id: i, text: v }));
      setGoodInput(goodArr);
      setNotGoodInput(notGoodArr);
    }
  }, [fetcher.data]);

  return (
    <Panel left="320px">
      <Form method="post">
        <div className="bg-primary flex h-12 w-full items-center justify-between px-4">
          <h1 className="text-xl font-semibold">후기 등록</h1>
          <button
            type="submit"
            className="bg-interaction rounded-full px-4 py-1 text-sm font-semibold"
          >
            저장
          </button>
        </div>
        <div className="h-screen w-full overflow-y-auto">
          <h2 className="mt-2 px-4 text-xl font-semibold">
            {fetcher.data ? (
              <>{fetcher.data.name}</>
            ) : (
              <>{location.state?.name}</>
            )}
          </h2>
          <div className="flex flex-col gap-12 px-4 pb-20 pt-6">
            <div>
              <p className="text-lg font-semibold">☕ 후기</p>
              {location.state && (
                <>
                  <input
                    name="cafeId"
                    value={location.state.cafeId}
                    readOnly
                    hidden
                  />
                  <input
                    name="name"
                    value={location.state.name}
                    readOnly
                    hidden
                  />
                  <input
                    name="reviewId"
                    value={location.state.reviewId}
                    readOnly
                    hidden
                  />
                  <input
                    name="booking"
                    value={location.state.booking}
                    readOnly
                    hidden
                  />
                </>
              )}
              <textarea
                name="description"
                defaultValue={fetcher.data?.description ?? ""}
                required
                placeholder="후기를 자유롭게 작성해주세요."
                className="mt-2 h-24 w-full resize-none rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
              ></textarea>
            </div>
            <div>
              <p className="text-lg font-semibold">👍 장점</p>
              <div className="mt-2 space-y-2">
                {goodInput.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between overflow-hidden rounded border border-neutral-300"
                  >
                    <input
                      name="good"
                      type="text"
                      defaultValue={v.text}
                      required
                      className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                      placeholder="장점을 입력해주세요."
                    />
                    <button
                      onClick={() => deleteInput("good", v.id)}
                      type="button"
                      className="pr-2 text-neutral-400"
                    >
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
                ))}
                <button
                  onClick={() => addInput("good")}
                  type="button"
                  className="bg-interaction mt-4 rounded-full px-4 py-1 text-xs font-semibold text-white"
                >
                  추가
                </button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">👎 단점</p>
              <div className="mt-2 space-y-2">
                {notGoodInput.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between overflow-hidden rounded border border-neutral-300"
                  >
                    <input
                      name="notGood"
                      type="text"
                      defaultValue={v.text}
                      required
                      className="w-[90%] px-3 py-2 outline-none placeholder:text-neutral-300"
                      placeholder="단점을 입력해주세요."
                    />
                    <button
                      onClick={() => deleteInput("notGood", v.id)}
                      type="button"
                      className="pr-2 text-neutral-400"
                    >
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
                ))}
                <button
                  onClick={() => addInput("notGood")}
                  type="button"
                  className="bg-interaction mt-4 rounded-full px-4 py-1 text-xs font-semibold text-white"
                >
                  추가
                </button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">💛 추천메뉴</p>
              <input
                name="recommend"
                type="text"
                defaultValue={fetcher.data?.recommend ?? ""}
                required
                className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
                placeholder="추천메뉴를 입력해주세요."
              />
            </div>
            <div>
              <p className="text-lg font-semibold">🏷️ 태그</p>
              <input
                name="tags"
                defaultValue={fetcher.data?.tags ?? ""}
                type="text"
                className="mt-2 w-full rounded border border-neutral-300 px-3 py-2 outline-none placeholder:text-neutral-300"
                placeholder="태그를 입력해주세요."
              />
            </div>
            <div>
              <p className="text-lg font-semibold">⭐ 별점</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  name="starRating"
                  required
                  type="number"
                  max={5}
                  min={0}
                  defaultValue={fetcher.data?.starRating ?? 0}
                  step={0.5}
                  className="w-20 rounded border border-neutral-300 px-3 py-1 outline-none placeholder:text-neutral-300"
                  placeholder="별점"
                />
                <p className="text-lg">/ 5</p>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Panel>
  );
}

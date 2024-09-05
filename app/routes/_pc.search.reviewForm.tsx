/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { PhotoIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

import { getReview } from "~/.server/review";
import { ActionInput, Input, Panel, Textarea } from "~/shared/ui";
import { IFieldInput, IReview } from "~/shared/types";
import { imageMaxSize } from "~/shared/lib/imageMaxSize";
import { IProfile } from "~/entities/user/types";
import { postReview } from "~/entities/review/model/postReview";
import { ImageSlider } from "~/shared/ui/ImageSlider";
import { useImageUpload } from "~/shared/hooks/useImageUpload";

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
  return await postReview(request);
}

export default function CafeReviewCreateRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher<IReview>();
  const { handleFileUpload, fileRef } = useImageUpload();
  const { user } = useOutletContext<{ user: IProfile }>();

  const [tagInputs, setTagInputs] = useState<IFieldInput[]>([
    { id: 0, text: "" },
  ]);
  const [preview, setPreview] = useState<string[]>();

  const addInput = useCallback(() => {
    const num = tagInputs.length !== 0 ? tagInputs.at(-1)?.id : 0;
    setTagInputs([...tagInputs, { id: num! + 1, text: "" }]);
  }, [tagInputs]);

  const deleteInput = useCallback(
    (id: number) => {
      const remove = tagInputs.filter((v) => v.id !== id);
      setTagInputs(remove);
    },
    [tagInputs]
  );

  useEffect(() => {
    if (location.state?.reviewId) {
      fetcher.load(`/search/reviewForm?reviewId=${location.state.reviewId}`);
    }
  }, [location.state]);

  useEffect(() => {
    if (fetcher.data) {
      const { tags } = fetcher.data;
      setTagInputs(tags.split(",").map((v, i) => ({ id: i, text: v })));

      if (fetcher.data.reviewImages) {
        setPreview(fetcher.data.reviewImages.split(","));
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <Panel left="320px">
      <Form method="post" encType="multipart/form-data">
        <div className="bg-primary flex h-12 w-full items-center justify-between px-4">
          <h1 className="text-xl font-semibold">
            {location.state?.reviewId ? "후기 수정" : "후기 등록"}
          </h1>
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
          {preview && preview[0] !== "" ? (
            <div className="mt-4">
              <ImageSlider
                data={preview}
                onClick={(e) => {
                  e.preventDefault();
                  handleFileUpload();
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFileUpload}
              className="bg-trueGray-100 mt-4 h-52 w-full outline-none"
            >
              <PhotoIcon className="mx-auto w-10" />
            </button>
          )}
          <input
            name="reviewImages"
            ref={fileRef}
            onChange={(e) => {
              if (e.target.files) {
                if (
                  e.target.files.length === 0 &&
                  preview &&
                  preview?.length > 0
                ) {
                  return setPreview(preview);
                }

                const files: string[] = [];
                for (const file of e.target.files) {
                  if (imageMaxSize(file)) return;
                  const url = URL.createObjectURL(file);
                  files.push(url);
                }
                setPreview(files);
              }
            }}
            type="file"
            accept=".jpg, .jpeg, .png"
            multiple
            hidden
          />
          <div className="flex flex-col gap-8 px-4 pb-20 pt-6">
            <div>
              <p className="text-lg font-semibold">☕ 후기</p>
              <div className="mt-2 h-44">
                <Textarea
                  name="description"
                  defaultValue={fetcher.data?.description ?? ""}
                  required
                  placeholder="후기를 자유롭게 작성해주세요."
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">🏷️ 태그</p>
              <div className="mt-2 space-y-2">
                {tagInputs.map((v) => (
                  <ActionInput
                    name="tags"
                    type="text"
                    defaultValue={v.text}
                    required
                    placeholder="태그를 입력해주세요."
                    key={v.id}
                    onClickButton={() => deleteInput(v.id)}
                    icon={<MinusIcon />}
                  />
                ))}
                <button
                  onClick={addInput}
                  type="button"
                  className="bg-interaction mt-4 rounded-full px-4 py-1 text-xs font-semibold text-white"
                >
                  추가
                </button>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">⭐ 별점</p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  name="starRating"
                  required
                  type="number"
                  max={5}
                  min={0}
                  defaultValue={fetcher.data?.starRating ?? 0}
                  step={1}
                  style={{ width: "60px" }}
                />
                <p className="text-lg">/ 5</p>
              </div>
            </div>
          </div>
        </div>
        <input name="authorId" type="text" hidden value={user.id} />
        <input name="visited" type="checkbox" hidden checked />
        {location.state && (
          <>
            <input
              name="cafeId"
              value={location.state.cafeId}
              readOnly
              hidden
            />
            <input name="x" value={location.state.x} readOnly hidden />
            <input name="y" value={location.state.y} readOnly hidden />
            <input name="name" value={location.state.name} readOnly hidden />
            <input
              name="reviewId"
              value={location.state.reviewId}
              readOnly
              hidden
            />
          </>
        )}
      </Form>
    </Panel>
  );
}

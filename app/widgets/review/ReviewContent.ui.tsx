import { memo } from "react";

interface IReviewContent {
  title: string;
  data: string[] | string | undefined;
}

export const ReviewContent = memo(function ReviewContent({
  title,
  data,
}: IReviewContent) {
  return (
    <div>
      <p className="text-lg font-semibold">{title}</p>
      {typeof data === "string" ? (
        <p className="px-3 py-2">{data}</p>
      ) : (
        <ul className="list-inside list-disc px-3 py-2">
          {data?.map((v, i) => <li key={i}>{v}</li>)}
        </ul>
      )}
    </div>
  );
});

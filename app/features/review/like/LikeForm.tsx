import { Form } from "@remix-run/react";

interface ILikeForm {
  data: {
    isLiked: string;
    reviewId: string;
    userId: string;
    count: number;
    likedBy: { id: string }[] | null;
  };
}

export function LikeForm({ data }: ILikeForm) {
  return (
    <Form method="post" navigate={false}>
      <input name="isLiked" type="text" value={data.isLiked} hidden readOnly />
      <input
        name="reviewId"
        type="text"
        value={data.reviewId}
        hidden
        readOnly
      />
      <input name="userId" type="text" value={data.userId} hidden readOnly />
      <button
        type="submit"
        className={`absolute bottom-6 right-4 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white shadow-md ${data.likedBy?.some((v) => v.id === data.userId) ? "text-red-500" : ""}`}
      >
        <span className="text-xl">❤</span>
        <span className="-mt-1 text-xs">{data.count}</span>
      </button>
    </Form>
  );
}

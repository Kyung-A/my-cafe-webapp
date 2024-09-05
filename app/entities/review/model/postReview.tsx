/* eslint-disable @typescript-eslint/no-explicit-any */
import { formDataPromise } from "~/shared/lib/formData";
import { uploadPromise } from "~/shared/lib/uploadPromise";
import { createReview, updateReview } from "~/.server/review";
import { redirect } from "@remix-run/node";

export async function postReview(request: Request) {
  const formData = await formDataPromise(request);

  const data: any = {};
  const tags: FormDataEntryValue[] = [];
  const imageUrls = [];

  const reviewImages: any = formData.getAll("reviewImages");
  const reviewId = String(formData.get("reviewId"));

  [...formData.entries()].forEach(([key, value]) => {
    if (key === "reviewId") return;
    if (key === "reviewImages") return;

    if (key === "tags") {
      tags.push(value);
      data[key] = tags.join(",");
    } else if (key === "starRating") {
      data[key] = Number(value);
    } else if (key === "visited") {
      data[key] = true;
    } else {
      data[key] = value;
    }
  });

  if (reviewImages[0] && reviewImages[0].size !== 0) {
    for (const img of reviewImages) {
      const imageUrl = await uploadPromise(img as Blob);
      imageUrls.push(imageUrl);
    }
    data["reviewImages"] = imageUrls.length > 0 ? imageUrls.join(",") : "";
  }

  if (reviewId) {
    data["id"] = reviewId;
    const id = await updateReview(data);
    return redirect(`/search/review/${id}`);
  } else {
    const id = await createReview(data);
    return redirect(`/search/review/${id}`);
  }
}

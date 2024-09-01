import { uploadImage } from "~/.server/storage";

export async function uploadPromise(img: Blob): Promise<string | null> {
  if (img?.size === 0) return null;

  try {
    const form = new FormData();
    form.append("image", img);

    const result = await uploadImage(form);
    return new Promise((resolve) => resolve(result));
  } catch (err) {
    console.error(err);
    return null;
  }
}

import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { updateUser } from "~/.server/storage";
import { formDataPromise } from "~/shared/utils/formData";
import { uploadPromise } from "~/shared/utils/uploadPromise";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await formDataPromise(request);

  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const profile = formData.get("profile") as File;

  if (profile?.size === 0) {
    await updateUser({ id, name });
    return redirect("/");
  } else {
    const imageUrl = await uploadPromise(profile);
    await updateUser({ id, name, profile: imageUrl as string });

    return redirect("/");
  }
}

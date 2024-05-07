import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { updateUser, uploadImage } from "~/.server/storage";
import { formDataPromise } from "~/shared/utils/formData";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await formDataPromise(request);

  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const profile = formData.get("profile") as File;

  if (profile?.size === 0) {
    await updateUser({ id, name });
    return redirect("/");
  } else {
    const form = new FormData();
    form.append("image", profile!);

    await uploadImage(form).then(async (resp) => {
      await updateUser({ id, name, profile: resp });
    });
    return redirect("/");
  }
}

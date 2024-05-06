import {
  ActionFunctionArgs,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import { updateUser, uploadImage } from "~/.server/storage";

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

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

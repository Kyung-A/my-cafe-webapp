import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { authSignup } from "~/entities/auth";
import { SignupForm } from "~/features/auth";
import { useImageUpload } from "~/hooks";

export async function action({ request }: ActionFunctionArgs) {
  const result = await authSignup(request);
  return result;
}

export default function SignupRoute() {
  const data = useActionData<typeof action>();
  const { handleFileUpload, fileRef } = useImageUpload();

  return (
    <SignupForm
      handleFileUpload={handleFileUpload}
      fileRef={fileRef}
      data={data}
    />
  );
}

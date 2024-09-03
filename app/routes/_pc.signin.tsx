import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { authSignin } from "~/entities/auth";
import { SigninForm } from "~/features/auth/authSignin";

export async function action({ request }: ActionFunctionArgs) {
  return await authSignin(request);
}

export default function SigninRoute() {
  const actionData = useActionData<typeof action>();

  return <SigninForm data={actionData} />;
}

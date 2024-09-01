import { json, redirect } from "@remix-run/node";
import { uploadPromise } from "~/shared/lib/uploadPromise";
import { formDataPromise } from "~/shared/lib/formData";
import { validate } from "../lib/validate";
import { findEmailApi, registerApi } from "../api/registerApi";
import { IAuthProps, IValidate } from "../types";

export async function authSignup(request: Request) {
  const formData = await formDataPromise(request);
  const data = Object.fromEntries(Array.from(formData.entries()));
  const { password2, ...otherData } = data;

  const userExists = await findEmailApi(data.email as string);
  const errors = validate({
    email: otherData.email,
    password: otherData.password,
    password2: password2,
    userExists,
  } as IValidate);
  if (Object.keys(errors).length > 0) return json({ errors });

  const imageUrl: string | null = await uploadPromise(data.profile as Blob);
  await registerApi({ ...otherData, profile: imageUrl } as IAuthProps);
  return redirect("/signin");
}

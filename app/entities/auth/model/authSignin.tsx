import { json } from "@remix-run/node";
import { signinApi } from "../api/registerApi";
import { createUserSession } from "~/.server/storage";
import { ISigninProps } from "../types";

export async function authSignin(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(Array.from(formData.entries()));

  const user = await signinApi({
    email: data.email,
    password: data.password,
  } as ISigninProps);

  if (!user)
    return json({ errors: "이메일 또는 비밀번호가 일치하지 않습니다." });

  return createUserSession(user!.id);
}

import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession, signin } from "~/.server/storage";
import arrowRight from "~/assets/arrowRight.svg";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors: Record<string, string> = {};
  const user = await signin({ email, password });

  if (!user) {
    errors.user = "이메일 또는 비밀번호가 일치하지 않습니다.";
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  return createUserSession(user!.id);
}

export default function SigninRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <h1 className="w-full text-center text-xl font-semibold">
        ☕ myCafe 로그인
      </h1>
      <div className="mt-8 space-y-3">
        <input
          name="email"
          className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
          type="email"
          required
          placeholder="이메일을 입력해주세요."
        />
        <input
          name="password"
          className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
          type="password"
          required
          placeholder="비밀번호를 입력해주세요."
        />
      </div>
      {actionData?.errors.user && (
        <p className="mt-2 pl-1 text-xs text-red-500">
          {actionData?.errors.user}
        </p>
      )}
      <div className="mt-8 w-full">
        <p className="text-center font-semibold">회원이 아니신가요?</p>
        <Link
          to="/signup"
          className="text-interaction mt-1 flex items-center justify-center gap-2 text-center font-semibold"
        >
          <span>회원가입 하기</span>
          <img src={arrowRight} className="w-5" alt="icon" />
        </Link>
      </div>
      <button
        type="submit"
        className="bg-interaction mx-auto mt-8 block w-40 rounded-full py-2 font-semibold text-white"
      >
        로그인
      </button>
    </Form>
  );
}

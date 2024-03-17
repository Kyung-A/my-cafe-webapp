import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { db } from "~/.server/db";
import { register } from "~/.server/storage";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const name = String(formData.get("name"));
  const password = String(formData.get("password"));
  const password2 = String(formData.get("password2"));

  const errors: Record<string, string> = {};

  if (!email.includes("@")) {
    errors.email = "올바른 이메일 형식이 아닙니다.";
  }
  if (password === password2) {
    errors.password = "비밀번호가 일치하지 않습니다";
  }

  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    errors.userExists = "이미 가입한 유저입니다.";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  await register({ email, name, password });
  return redirect("/signin");
}

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <h1 className="w-full text-center text-xl font-semibold">
        ☕ myCafe 회원가입
      </h1>
      <div className="mt-8 space-y-3">
        <div>
          <input
            name="email"
            className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
            type="text"
            required
            placeholder="이메일을 입력해주세요."
          />
          {actionData?.errors.email && (
            <p className="mt-1 pl-2 text-xs text-red-500">
              {actionData?.errors.email}
            </p>
          )}
        </div>
        <input
          name="name"
          className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
          type="text"
          required
          placeholder="이름을 입력해주세요."
        />
        <input
          name="password"
          className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
          type="password"
          required
          placeholder="비밀번호를 입력해주세요."
        />
        <div>
          <input
            name="password"
            className="w-full rounded-full border border-neutral-400 px-2 py-2 outline-none placeholder:text-neutral-400"
            type="password"
            required
            placeholder="비밀번호를 한번 더 입력해주세요."
          />
          {actionData?.errors.password && (
            <p className="mt-1 pl-2 text-xs text-red-500">
              {actionData?.errors.password}
            </p>
          )}
        </div>
      </div>
      {actionData?.errors.userExists && (
        <div className="mt-4 w-full">
          <p className="text-center text-sm font-semibold">
            이미 회원가입한 유저입니다.
          </p>
          <Link
            to="/signin"
            className="text-interaction mt-1 flex items-center justify-center gap-2 text-center font-semibold"
          >
            <span>로그인 하기</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
      )}
      <button
        type="submit"
        className="bg-interaction mx-auto mt-8 block w-40 rounded-full py-2 font-semibold text-white"
      >
        회원가입
      </button>
    </Form>
  );
}

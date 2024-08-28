import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { db } from "~/.server/db";
import { register } from "~/.server/storage";
import { useState } from "react";
import { useImageUpload } from "~/hooks";
import { uploadPromise } from "~/shared/utils/uploadPromise";
import { formDataPromise } from "~/shared/utils/formData";
import { imageMaxSize } from "~/shared/utils/imageMaxSize";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await formDataPromise(request);

  const email = String(formData.get("email"));
  const name = String(formData.get("name"));
  const password = String(formData.get("password"));
  const password2 = String(formData.get("password2"));
  const profile = formData.get("profile") as File;

  const errors: Record<string, string> = {};

  if (!email.includes("@")) errors.email = "올바른 이메일 형식이 아닙니다.";
  if (password === password2) errors.password = "비밀번호가 일치하지 않습니다";

  const userExists = await db.user.findFirst({
    where: { email },
  });

  if (userExists) errors.userExists = "이미 가입한 유저입니다.";
  if (Object.keys(errors).length > 0) return json({ errors });

  if (profile?.size === 0) {
    await register({ email, name, password });
    return redirect("/signin");
  } else {
    const imageUrl = await uploadPromise(profile);
    await register({ email, name, password, profile: imageUrl as string });

    return redirect("/signin");
  }
}

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();
  const { handleFileUpload, fileRef } = useImageUpload();
  const [preview, setPreview] = useState<string>();

  return (
    <Form method="post" encType="multipart/form-data">
      <h1 className="w-full text-center text-xl font-semibold">
        ☕ myCafe 회원가입
      </h1>
      <div className="mt-8 space-y-3">
        <div>
          <div className="bg-trueGray-200 relative mx-auto h-20 w-20 overflow-hidden rounded-full">
            <button
              type="button"
              onClick={handleFileUpload}
              className="absolute left-0 top-0 z-10 block h-full w-full bg-transparent"
            ></button>
            {preview && (
              <img
                src={preview}
                alt="프로필 이미지"
                className="absolute z-[5] h-full w-full object-cover"
              />
            )}
          </div>
          <input
            name="profile"
            ref={fileRef}
            onChange={(e) => {
              if (e.target.files) {
                for (const file of e.target.files) {
                  if (imageMaxSize(file)) return;
                  setPreview(URL.createObjectURL(file));
                }
              }
            }}
            type="file"
            accept=".jpg, .jpeg, .png"
            hidden
          />
        </div>
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
            <ArrowLongRightIcon />
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

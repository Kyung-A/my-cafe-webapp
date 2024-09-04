import { Form } from "@remix-run/react";
import { Input } from "~/shared/ui";
import { AuthLayout, ErrorMsg, MsgWithAction } from "~/widgets/auth";

interface ISigninForm {
  data: { errors: string } | undefined;
}

export function SigninForm({ data }: ISigninForm) {
  return (
    <AuthLayout>
      <Form method="post">
        <div className="mt-8 space-y-3">
          <Input
            name="email"
            type="email"
            required
            placeholder="이메일을 입력해주세요."
          />
          <Input
            name="password"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요."
          />
        </div>
        {data?.errors && <ErrorMsg text={data?.errors} />}
        <div className="mt-8 w-full">
          <MsgWithAction
            link="/signup"
            buttonText="회원가입 하기"
            Msg="회원이 아니신가요?"
          />
        </div>
        <button
          type="submit"
          className="bg-interaction mx-auto mt-8 block w-40 rounded-full py-2 font-semibold text-white"
        >
          로그인
        </button>
      </Form>
    </AuthLayout>
  );
}

import { Form } from "@remix-run/react";
import { IRegisterErrors } from "~/entities/auth/types";
import { Input } from "~/shared/ui";
import {
  AuthLayout,
  ErrorMsg,
  MsgWithAction,
  SubmitButton,
} from "~/widgets/auth";
import { UploadProfile } from "./UploadProfile.ui";

interface ISignupForm {
  data: { errors: IRegisterErrors } | undefined;
  handleFileUpload: () => void;
  fileRef: React.MutableRefObject<HTMLInputElement | null>;
}

export function SignupForm({ data, handleFileUpload, fileRef }: ISignupForm) {
  return (
    <AuthLayout>
      <Form method="post" encType="multipart/form-data">
        <div className="mt-8 space-y-3">
          {/* <UploadProfile
            handleFileUpload={handleFileUpload}
            fileRef={fileRef}
          /> */}
          <div>
            <Input
              name="email"
              type="text"
              required
              placeholder="이메일을 입력해주세요."
            />
            {!data?.errors.userExists && data?.errors.email && (
              <ErrorMsg text={data?.errors.email} />
            )}
          </div>
          <Input
            name="name"
            type="text"
            required
            placeholder="이름을 입력해주세요."
          />
          <Input
            name="password"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요."
          />
          <div>
            <Input
              name="password2"
              type="password"
              required
              placeholder="비밀번호를 한번 더 입력해주세요."
            />
            {!data?.errors.userExists && data?.errors.password && (
              <ErrorMsg text={data?.errors.password} />
            )}
          </div>
        </div>
        {data?.errors.userExists && (
          <div className="mt-4 w-full">
            <MsgWithAction
              link="/signin"
              buttonText="로그인 하기"
              Msg="이미 회원가입한 유저입니다."
            />
          </div>
        )}
        <SubmitButton />
      </Form>
    </AuthLayout>
  );
}

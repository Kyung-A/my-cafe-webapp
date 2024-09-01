import { IRegisterErrors, IValidate } from "../types";

export function validate({
  email,
  password,
  password2,
  userExists,
}: IValidate): IRegisterErrors {
  const errors: IRegisterErrors = {};

  if (!email.includes("@")) errors.email = "올바른 이메일 형식이 아닙니다.";
  if (password !== password2) errors.password = "비밀번호가 일치하지 않습니다";
  if (userExists) errors.userExists = "이미 가입한 유저입니다.";

  return errors;
}

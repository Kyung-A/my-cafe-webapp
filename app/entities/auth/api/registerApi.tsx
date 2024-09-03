import { db } from "~/.server/db";
import { IAuthProps, ISigninProps, ISigninPromise } from "../types";
import { register, signin } from "~/.server/storage";

export async function registerApi(user: IAuthProps): Promise<void> {
  try {
    return await register(user);
  } catch (e) {
    console.error(e);
  }
}

export async function findEmailApi(email: string): Promise<boolean> {
  let userExists = false;
  try {
    const result = await db.user.findFirst({
      where: { email },
    });

    return !result ? (userExists = false) : (userExists = true);
  } catch (e) {
    console.error(e);
  }
  return userExists;
}

export async function signinApi({
  email,
  password,
}: ISigninProps): Promise<ISigninPromise | null> {
  let user = null;
  try {
    user = await signin({ email, password });
    return user;
  } catch (e) {
    console.error(e);
  }

  return user;
}

import { db } from "~/.server/db";
import { IAuthProps } from "../types";
import { register } from "~/.server/storage";

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

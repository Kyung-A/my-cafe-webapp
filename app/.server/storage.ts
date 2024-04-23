import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db";
import { IRegister, ISignin } from "~/shared/types";

const sessionSecret = process.env.SESSION_SECRET;

// 회원가입
export async function register({ email, password, name }: IRegister) {
  const passwordHash = await bcrypt.hash(password as string, 10);
  await db.user.create({
    data: { email, passwordHash, name },
  });
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "_seesion",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [sessionSecret!],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
});

// token 가져오기
export function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// 유저 정보 불러오기
export async function getUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    return user;
  } else {
    redirect("/", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
    return null;
  }
}

// 로그인
export async function signin({ email, password }: ISignin) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, email, name: user.name };
}

// token 생성
export async function createUserSession(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

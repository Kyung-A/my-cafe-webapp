import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "./db";
import { IRegister, ISignin } from "~/shared/types";

const sessionSecret = process.env.SESSION_SECRET;

// 회원가입
export async function register({ email, password, name }: IRegister) {
  const passwordHash = await bcrypt.hash(password, 10);
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
export function getToken(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// token 검증
function verifyToken(token: string) {
  try {
    return jwt.verify(token, sessionSecret!);
  } catch (err) {
    // console.error(err);
    return null;
  }
}

// 유저 정보 불러오기
export async function getUser(request: Request) {
  const session = await getToken(request);

  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");
  const userId = session.get("userId");

  const access = verifyToken(accessToken);
  const refresh = verifyToken(refreshToken);

  if (!access && !refresh) {
    redirect("/", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
    return null;
  }

  if (access && refresh) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    return user;
  }

  if (!access && refresh) {
    const accessToken = jwt.sign({ id: userId }, sessionSecret!, {
      expiresIn: "3h",
    });
    session.set("accessToken", accessToken);
    return null;
  }
  if (access && !refresh) {
    const refreshToken = jwt.sign({}, sessionSecret!, {
      expiresIn: "10d",
    });
    session.set("refreshToken", refreshToken);
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
export async function createToken(userId: string) {
  const session = await storage.getSession();

  const accessToken = jwt.sign({ id: userId }, sessionSecret!, {
    expiresIn: "3h",
  });
  const refreshToken = jwt.sign({}, sessionSecret!, {
    expiresIn: "10d",
  });

  session.set("userId", userId);
  session.set("accessToken", accessToken);
  session.set("refreshToken", refreshToken);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

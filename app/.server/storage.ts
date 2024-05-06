import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import axios from "axios";

import { db } from "./db";
import { IRegister, ISignin } from "~/shared/types";

const sessionSecret = process.env.SESSION_SECRET;

export async function register({ email, password, name, profile }: IRegister) {
  const passwordHash = await bcrypt.hash(password as string, 10);
  await db.user.create({
    data: { email, passwordHash, name, profile },
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

export function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        _count: {
          select: { review: true, followers: true, following: true },
        },
      },
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

export async function signin({ email, password }: ISignin) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, email, name: user.name };
}

export async function createUserSession(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-cookie": await storage.destroySession(session),
    },
  });
}

export async function uploadImage(data: FormData) {
  try {
    const result = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMG_STORAGE_KEY}`,
      data
    );
    return result.data.data.display_url;
  } catch (err) {
    console.error(err);
    return null;
  }
}

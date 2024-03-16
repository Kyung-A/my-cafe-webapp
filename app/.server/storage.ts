import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "./db";
import { IRegister } from "~/shared/types";

const sessionSecret = process.env.SESSION_SECRET;

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

export async function signin({ email, password }) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, email, name: user.name };
}

export async function createToken(userId: string) {
  const session = await storage.getSession();
  const acessToken = jwt.sign({ id: userId }, sessionSecret!, {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign({}, sessionSecret!, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
  session.set("acessToken", acessToken);
  session.set("refreshToken", refreshToken);

  console.log(session);

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

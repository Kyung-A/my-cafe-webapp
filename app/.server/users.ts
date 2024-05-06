import { db } from "./db";

export async function getUsers() {
  try {
    const result = await db.user.findMany({
      select: {
        id: true,
        passwordHash: false,
        email: false,
        name: true,
        createdAt: false,
        updatedAt: false,
        profile: true,
        _count: {
          select: { review: true, followers: true, following: true },
        },
      },
      orderBy: {
        review: {
          _count: "desc",
        },
      },
      take: 10,
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// app/api/stats/route.ts
// Returns reading statistics for the logged-in user

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const books = await prisma.book.findMany({ where: { userId } });

  const finished = books.filter((b) => b.status === "finished");
  const reading = books.filter((b) => b.status === "reading");
  const wishlist = books.filter((b) => b.status === "wishlist");

  const ratings = finished.filter((b) => b.rating).map((b) => b.rating as number);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  // Books finished this year
  const thisYear = new Date().getFullYear();
  const finishedThisYear = finished.filter(
    (b) => new Date(b.updatedAt).getFullYear() === thisYear
  ).length;

  return NextResponse.json({
    total: books.length,
    finished: finished.length,
    reading: reading.length,
    wishlist: wishlist.length,
    finishedThisYear,
    avgRating: Math.round(avgRating * 10) / 10,
  });
}

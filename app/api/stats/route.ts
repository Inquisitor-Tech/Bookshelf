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

  // Reading pace calculations
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const finishedLast30Days = finished.filter(
    (b) => new Date(b.updatedAt) >= last30Days
  ).length;

  // Monthly reading trends (last 6 months)
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const finishedInMonth = finished.filter(
      (b) => {
        const updated = new Date(b.updatedAt);
        return updated >= monthStart && updated <= monthEnd;
      }
    ).length;
    
    monthlyTrends.push({
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: finishedInMonth
    });
  }

  // Reading streak (consecutive days with reading activity)
  const sortedBooks = books
    .filter(b => b.status === 'finished')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const book of sortedBooks) {
    const bookDate = new Date(book.updatedAt);
    bookDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - bookDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= currentStreak) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Top rated books
  const topRatedBooks = finished
    .filter(b => b.rating && b.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)
    .map(b => ({
      title: b.title,
      author: b.author,
      rating: b.rating
    }));

  return NextResponse.json({
    total: books.length,
    finished: finished.length,
    reading: reading.length,
    wishlist: wishlist.length,
    finishedThisYear,
    avgRating: Math.round(avgRating * 10) / 10,
    booksPerMonth: Math.round(finishedLast30Days * 30 / 10) / 10,
    currentStreak,
    monthlyTrends,
    topRatedBooks,
    pagesRead: null, // TODO: Add page tracking
    averageBookLength: null // TODO: Calculate when pages are tracked
  });
}

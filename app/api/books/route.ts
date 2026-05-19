// app/api/books/route.ts
// GET - list all books for the logged-in user
// POST - add a new book

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const books = await prisma.book.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { title, author, status, rating, notes } = await req.json();

  if (!title || !author || !status) {
    return NextResponse.json(
      { error: "Title, author, and status are required" },
      { status: 400 }
    );
  }

  const book = await prisma.book.create({
    data: {
      title,
      author,
      status,
      rating: rating ? Number(rating) : null,
      notes: notes || null,
      userId,
    },
  });
  return NextResponse.json(book);
}

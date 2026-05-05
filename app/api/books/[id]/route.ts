// app/api/books/[id]/route.ts
// PATCH - update a book
// DELETE - remove a book
// All operations are scoped to the authenticated user

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book || book.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data = await req.json();
  const updated = await prisma.book.update({
    where: { id: params.id },
    data: {
      title: data.title ?? book.title,
      author: data.author ?? book.author,
      status: data.status ?? book.status,
      rating: data.rating !== undefined ? data.rating : book.rating,
      notes: data.notes !== undefined ? data.notes : book.notes,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book || book.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.book.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

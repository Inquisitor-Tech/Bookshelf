// app/page.tsx
// Home page - shows the user's bookshelf with filters and add form

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { AddBookForm } from "@/components/AddBookForm";
import { SkeletonCard } from "@/components/SkeletonCard";

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  notes: string | null;
  coverUrl?: string | null;
  startDate?: string | null;
  finishDate?: string | null;
  pages?: number | null;
  currentPage?: number | null;
};

const FILTERS = [
  { value: "all",      label: "All" },
  { value: "reading",  label: "📖 Reading" },
  { value: "finished", label: "✅ Finished" },
  { value: "wishlist", label: "⭐ Wishlist" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchBooks();
  }, [status]);

  async function fetchBooks() {
    setLoading(true);
    const res = await fetch("/api/books");
    if (res.ok) setBooks(await res.json());
    setLoading(false);
  }

  async function handleAdd(data: any) {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newBook = await res.json();
      setBooks([newBook, ...books]);
    }
  }

  async function handleUpdate(id: string, data: Partial<Book>) {
    const res = await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setBooks(books.map((b) => (b.id === id ? updated : b)));
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) setBooks(books.filter((b) => b.id !== id));
  }

  const filtered = filter === "all" ? books : books.filter((b) => b.status === filter);

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Your Bookshelf</h1>
          <p className="text-ink/60">
            {books.length} {books.length === 1 ? "book" : "books"} in your collection
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === f.value
                  ? "bg-ink text-cream"
                  : "bg-white border border-ink/20 hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AddBookForm onAdd={handleAdd} />
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AddBookForm onAdd={handleAdd} />
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && books.length > 0 && (
          <p className="text-center text-ink/60 py-8">
            No books in this category yet.
          </p>
        )}
      </main>
    </div>
  );
}

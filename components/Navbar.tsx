// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-ink/10 bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
          📚 BookShelf
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/" className="hover:underline">My Books</Link>
              <Link href="/stats" className="hover:underline">Stats</Link>
              <span className="text-ink/60">{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-3 py-1.5 border border-ink/20 rounded hover:bg-ink hover:text-cream transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link
                href="/register"
                className="px-3 py-1.5 bg-ink text-cream rounded hover:bg-accent transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

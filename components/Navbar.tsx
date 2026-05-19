// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-ink/10 dark:border-dark-border bg-cream dark:bg-dark-bg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-ink dark:text-dark-text">
          📚 BookShelf
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/" className="hover:underline text-ink dark:text-dark-text">My Books</Link>
              <Link href="/stats" className="hover:underline text-ink dark:text-dark-text">Stats</Link>
              <span className="text-ink/60 dark:text-dark-muted">{session.user?.email}</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-ink/20 dark:border-dark-border hover:bg-ink/5 dark:hover:bg-dark-border transition"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-3 py-1.5 border border-ink/20 dark:border-dark-border rounded hover:bg-ink hover:text-cream dark:hover:bg-dark-card dark:text-dark-text transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline text-ink dark:text-dark-text">Login</Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-ink/20 dark:border-dark-border hover:bg-ink/5 dark:hover:bg-dark-border transition"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
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

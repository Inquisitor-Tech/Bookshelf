// app/stats/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

type Stats = {
  total: number;
  finished: number;
  reading: number;
  wishlist: number;
  finishedThisYear: number;
  avgRating: number;
  booksPerMonth: number;
  currentStreak: number;
  monthlyTrends: Array<{ month: string; count: number }>;
  topRatedBooks: Array<{ title: string; author: string; rating: number }>;
  pagesRead: null;
  averageBookLength: null;
};

export default function StatsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/stats")
        .then((r) => r.json())
        .then(setStats);
    }
  }, [status]);

  if (!stats) return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-ink/60">Loading stats...</p>
      </main>
    </div>
  );

  const cards = [
    { label: "Total Books",         value: stats.total,            icon: "📚" },
    { label: "Finished",            value: stats.finished,         icon: "✅" },
    { label: "Currently Reading",   value: stats.reading,          icon: "📖" },
    { label: "Wishlist",            value: stats.wishlist,         icon: "⭐" },
    { label: "Finished This Year",  value: stats.finishedThisYear, icon: "🏆" },
    { label: "Average Rating",      value: stats.avgRating || "—", icon: "🌟" },
    { label: "Books/Month",         value: stats.booksPerMonth,    icon: "📈" },
    { label: "Reading Streak",      value: stats.currentStreak,    icon: "🔥" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-serif text-4xl font-bold mb-2">Reading Stats</h1>
        <p className="text-ink/60 mb-10">A snapshot of your reading habits</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-ink/10 rounded-lg p-6 shadow-sm"
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="font-serif text-4xl font-bold">{card.value}</div>
              <div className="text-sm text-ink/60 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trends */}
          <div className="bg-white border border-ink/10 rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold mb-4">📊 Monthly Reading Trends</h2>
            <div className="space-y-2">
              {stats.monthlyTrends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between">
                  <span className="text-sm text-ink/60">{trend.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-ink/10 rounded-full h-2">
                      <div 
                        className="bg-ink h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((trend.count / Math.max(...stats.monthlyTrends.map(t => t.count))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-4">{trend.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Books */}
          <div className="bg-white border border-ink/10 rounded-lg p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold mb-4">⭐ Top Rated Books</h2>
            {stats.topRatedBooks.length > 0 ? (
              <div className="space-y-3">
                {stats.topRatedBooks.map((book, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-lg font-bold text-ink/40">#{index + 1}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{book.title}</h4>
                      <p className="text-xs text-ink/60">{book.author}</p>
                    </div>
                    <div className="text-sm text-yellow-600">
                      {"⭐".repeat(book.rating)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink/60 italic">No highly rated books yet. Finish and rate some books to see them here!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

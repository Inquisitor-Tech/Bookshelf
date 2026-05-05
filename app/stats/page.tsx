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
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-serif text-4xl font-bold mb-2">Reading Stats</h1>
        <p className="text-ink/60 mb-10">A snapshot of your reading habits</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </main>
    </div>
  );
}

// components/BookCard.tsx
"use client";

import { useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  notes: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  reading: "📖 Reading",
  finished: "✅ Finished",
  wishlist: "⭐ Wishlist",
};

const STATUS_COLOURS: Record<string, string> = {
  reading: "bg-blue-100 text-blue-900",
  finished: "bg-green-100 text-green-900",
  wishlist: "bg-yellow-100 text-yellow-900",
};

export function BookCard({
  book,
  onUpdate,
  onDelete,
}: {
  book: Book;
  onUpdate: (id: string, data: Partial<Book>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(book);

  if (editing) {
    return (
      <div className="bg-white border border-ink/10 rounded-lg p-5 shadow-sm">
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className="w-full mb-2 px-3 py-1.5 border border-ink/20 rounded font-serif"
          placeholder="Title"
        />
        <input
          value={draft.author}
          onChange={(e) => setDraft({ ...draft, author: e.target.value })}
          className="w-full mb-2 px-3 py-1.5 border border-ink/20 rounded text-sm"
          placeholder="Author"
        />
        <select
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value })}
          className="w-full mb-2 px-3 py-1.5 border border-ink/20 rounded text-sm"
        >
          <option value="wishlist">Wishlist</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
        {draft.status === "finished" && (
          <select
            value={draft.rating ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, rating: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full mb-2 px-3 py-1.5 border border-ink/20 rounded text-sm"
          >
            <option value="">No rating</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>
        )}
        <textarea
          value={draft.notes ?? ""}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          className="w-full mb-3 px-3 py-1.5 border border-ink/20 rounded text-sm"
          placeholder="Notes (optional)"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              onUpdate(book.id, draft);
              setEditing(false);
            }}
            className="flex-1 py-1.5 bg-ink text-cream rounded text-sm hover:bg-accent transition"
          >
            Save
          </button>
          <button
            onClick={() => {
              setDraft(book);
              setEditing(false);
            }}
            className="flex-1 py-1.5 border border-ink/20 rounded text-sm hover:bg-ink/5 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOURS[book.status]}`}>
          {STATUS_LABELS[book.status]}
        </span>
        {book.rating && (
          <span className="text-sm text-yellow-600">
            {"⭐".repeat(book.rating)}
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg font-bold leading-tight">{book.title}</h3>
      <p className="text-sm text-ink/60 mb-2">{book.author}</p>
      {book.notes && <p className="text-sm text-ink/70 italic mb-3">"{book.notes}"</p>}
      <div className="flex gap-2 mt-3 text-xs">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 border border-ink/20 rounded hover:bg-ink/5 transition"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${book.title}"?`)) onDelete(book.id);
          }}
          className="px-3 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

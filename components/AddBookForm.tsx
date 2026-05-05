// components/AddBookForm.tsx
"use client";

import { useState } from "react";

export function AddBookForm({ onAdd }: { onAdd: (data: any) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("wishlist");
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setSubmitting(true);
    await onAdd({ title, author, status, rating, notes });
    setTitle("");
    setAuthor("");
    setStatus("wishlist");
    setRating(null);
    setNotes("");
    setOpen(false);
    setSubmitting(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full p-6 border-2 border-dashed border-ink/20 rounded-lg text-ink/60 hover:border-accent hover:text-accent transition font-serif text-lg"
      >
        + Add a Book
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ink/10 rounded-lg p-5 shadow-sm"
    >
      <h3 className="font-serif text-lg font-bold mb-3">Add a New Book</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 px-3 py-2 border border-ink/20 rounded font-serif"
        placeholder="Title"
        required
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full mb-2 px-3 py-2 border border-ink/20 rounded text-sm"
        placeholder="Author"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full mb-2 px-3 py-2 border border-ink/20 rounded text-sm"
      >
        <option value="wishlist">⭐ Want to read</option>
        <option value="reading">📖 Currently reading</option>
        <option value="finished">✅ Finished</option>
      </select>
      {status === "finished" && (
        <select
          value={rating ?? ""}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
          className="w-full mb-2 px-3 py-2 border border-ink/20 rounded text-sm"
        >
          <option value="">Rating (optional)</option>
          <option value="1">⭐ 1</option>
          <option value="2">⭐⭐ 2</option>
          <option value="3">⭐⭐⭐ 3</option>
          <option value="4">⭐⭐⭐⭐ 4</option>
          <option value="5">⭐⭐⭐⭐⭐ 5</option>
        </select>
      )}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full mb-3 px-3 py-2 border border-ink/20 rounded text-sm"
        placeholder="Notes (optional)"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2 bg-ink text-cream rounded hover:bg-accent transition disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Book"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2 border border-ink/20 rounded hover:bg-ink/5 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

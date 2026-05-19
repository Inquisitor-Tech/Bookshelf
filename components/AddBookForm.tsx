// components/AddBookForm.tsx
"use client";

import { useState } from "react";
import { BookSearch } from "./BookSearch";
import { extractCoverUrl, extractIsbn, type OpenLibraryBook } from "@/lib/openlibrary";

export function AddBookForm({ onAdd }: { onAdd: (data: any) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("wishlist");
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn, setIsbn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleBookSelect(book: OpenLibraryBook) {
    setTitle(book.title);
    setAuthor(book.author_name?.join(", ") || "");
    setCoverUrl(extractCoverUrl(book) || "");
    setIsbn(extractIsbn(book) || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setSubmitting(true);
    await onAdd({ 
      title, 
      author, 
      status, 
      rating, 
      notes, 
      coverUrl, 
      isbn,
      startDate: startDate || null,
      finishDate: finishDate || null,
      pages: pages ? Number(pages) : null,
      currentPage: currentPage ? Number(currentPage) : null
    });
    setTitle("");
    setAuthor("");
    setStatus("wishlist");
    setRating(null);
    setNotes("");
    setCoverUrl("");
    setIsbn("");
    setStartDate("");
    setFinishDate("");
    setPages("");
    setCurrentPage("");
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
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-ink/70 mb-2">
          Search for a book (optional)
        </label>
        <BookSearch onSelect={handleBookSelect} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-ink/20 rounded font-serif"
          placeholder="Title"
          required
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-ink/20 rounded text-sm"
          placeholder="Author"
          required
        />
      </div>
      
      {coverUrl && (
        <div className="mb-3">
          <p className="text-xs text-ink/60 mb-1">Book cover preview:</p>
          <div className="flex gap-3">
            <img
              src={coverUrl}
              alt="Book cover preview"
              className="w-16 h-24 object-cover rounded border border-ink/10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove cover
            </button>
          </div>
        </div>
      )}
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
      
      {/* Progress Tracking Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1">
            Start Date (optional)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-ink/20 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1">
            Finish Date (optional)
          </label>
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            className="w-full px-3 py-2 border border-ink/20 rounded text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-ink/70 mb-1">
            Total Pages (optional)
          </label>
          <input
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full px-3 py-2 border border-ink/20 rounded text-sm"
            placeholder="0"
            min="1"
          />
        </div>
        {(status === "reading") && (
          <div>
            <label className="block text-xs font-medium text-ink/70 mb-1">
              Current Page
            </label>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="w-full px-3 py-2 border border-ink/20 rounded text-sm"
              placeholder="0"
              min="1"
              max={pages || undefined}
            />
          </div>
        )}
      </div>
      
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

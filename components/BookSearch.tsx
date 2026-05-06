// components/BookSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { searchBooks, type OpenLibraryBook } from "@/lib/openlibrary";

interface BookSearchProps {
  onSelect: (book: OpenLibraryBook) => void;
}

export function BookSearch({ onSelect }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OpenLibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  async function handleSearch() {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const books = await searchBooks(query);
      setResults(books);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(book: OpenLibraryBook) {
    onSelect(book);
    setQuery("");
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books by title or author..."
        className="w-full px-4 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
      
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-white border border-ink/10 rounded-lg shadow-sm">
          <p className="text-sm text-ink/60">Searching...</p>
        </div>
      )}
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ink/10 rounded-lg shadow-sm max-h-80 overflow-y-auto z-10">
          {results.map((book) => (
            <button
              key={book.key}
              onClick={() => handleSelect(book)}
              className="w-full p-3 text-left hover:bg-ink/5 border-b border-ink/5 last:border-b-0 transition"
            >
              <div className="flex items-start gap-3">
                {book.cover_i && (
                  <img
                    src={`https://openlibrary.org/covers/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{book.title}</h4>
                  <p className="text-xs text-ink/60">
                    {book.author_name?.join(", ") || "Unknown author"}
                  </p>
                  {book.first_publish_year && (
                    <p className="text-xs text-ink/40">{book.first_publish_year}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {showResults && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-white border border-ink/10 rounded-lg shadow-sm">
          <p className="text-sm text-ink/60">No books found</p>
        </div>
      )}
    </div>
  );
}

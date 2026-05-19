// lib/openlibrary.ts
// Utility functions for Open Library API integration

const OPEN_LIBRARY_BASE = 'https://openlibrary.org';

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  edition_key?: string[];
}

export interface OpenLibraryCover {
  [key: string]: string;
}

export async function searchBooks(query: string): Promise<OpenLibraryBook[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,first_publish_year,isbn,cover_i,edition_key`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error searching Open Library:', error);
    return [];
  }
}

export function getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getIsbnCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

export async function getBookByIsbn(isbn: string): Promise<OpenLibraryBook | null> {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_BASE}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    return data[bookKey] || null;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return null;
  }
}

export function extractIsbn(book: OpenLibraryBook): string | null {
  return book.isbn?.[0] || null;
}

export function extractCoverUrl(book: OpenLibraryBook): string | null {
  if (book.cover_i) {
    return getCoverUrl(book.cover_i);
  }
  
  const isbn = extractIsbn(book);
  if (isbn) {
    return getIsbnCoverUrl(isbn);
  }
  
  return null;
}

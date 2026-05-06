// app/layout.tsx
// Root layout - wraps all pages with providers and basic HTML structure

import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "BookShelf",
  description: "A personal reading tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cream text-ink dark:bg-dark-bg dark:text-dark-text transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

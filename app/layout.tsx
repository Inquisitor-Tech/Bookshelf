// app/layout.tsx
// Root layout - wraps every page

import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "BookShelf — Personal Reading Tracker",
  description: "Track your books, log progress, and see your reading habits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

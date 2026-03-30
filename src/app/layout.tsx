import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bagfolk - your bags, but alive",
  description: "Watch your crypto portfolio come alive as cute little degenerates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

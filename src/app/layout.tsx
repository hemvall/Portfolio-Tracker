import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BagTown - Your Wallets, Alive",
  description: "Watch your crypto wallets come alive in a 3D village",
  icons: {
    icon: "/logo.ico",
  },
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

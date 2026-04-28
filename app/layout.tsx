import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NirKono",
  description: "Hello World baseline for NirKono"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

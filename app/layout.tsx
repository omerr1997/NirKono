import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NirKono Activities",
  description: "Activity catalogue for NirKono"
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

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ThemeLayout from "./ThemeLayout";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Created by Swapnadip Paul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeLayout>{children}</ThemeLayout>
        <Analytics />
      </body>
    </html>
  );
}

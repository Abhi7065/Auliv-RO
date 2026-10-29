import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auliv RO’s | Water Purifiers & Care for Every Brand",
  description: "Discover Auliv water purifiers. Book RO installation, repairs, filter replacement and AMC care for all brands in Delhi NCR.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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

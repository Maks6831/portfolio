import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhammad Ali Khan",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[6000] focus:rounded-lg focus:bg-surface-raised focus:px-4 focus:py-3 focus:text-sm focus:text-text-primary focus:outline focus:outline-2 focus:outline-focus-ring"
        >
          Skip to content
        </a>
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { siteMeta } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.origin),
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteMeta.name,
    title: siteMeta.title,
    description: siteMeta.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

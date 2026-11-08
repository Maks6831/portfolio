import type { Metadata } from "next";
import "./globals.css";
import { person, siteMeta } from "@/content/site";

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

// Person entity for name search. `<` is escaped so content can never close the script tag.
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.jobTitle,
  url: person.url,
  sameAs: person.sameAs,
  address: {
    "@type": "PostalAddress",
    addressLocality: person.address.locality,
    addressCountry: person.address.country,
  },
}).replace(/</g, "\\u003c");

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      </body>
    </html>
  );
}

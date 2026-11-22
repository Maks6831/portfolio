import { person, siteMeta } from "@/content/site";
import type { CaseStudy } from "@/content/work/types";

// Structured data for name search: one Person and one WebSite node with stable @ids, plus the page's own node.
// Rendered by the home page and the case study only (not the 404). `<` is escaped so content can never close the
// script tag.

const origin = siteMeta.origin;
const ids = {
  person: `${origin}/#person`,
  website: `${origin}/#website`,
};

const personNode = {
  "@type": "Person",
  "@id": ids.person,
  name: person.name,
  jobTitle: person.jobTitle,
  description: person.description,
  url: person.url,
  knowsAbout: person.knowsAbout,
  sameAs: person.sameAs,
  address: {
    "@type": "PostalAddress",
    addressLocality: person.address.locality,
    addressCountry: person.address.country,
  },
};

const websiteNode = {
  "@type": "WebSite",
  "@id": ids.website,
  url: origin,
  name: siteMeta.name,
  inLanguage: "en-GB",
  publisher: { "@id": ids.person },
};

const serialize = (graph: object[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");

export const homeJsonLd = () =>
  serialize([
    {
      "@type": "ProfilePage",
      "@id": `${origin}/#profilepage`,
      url: origin,
      name: siteMeta.title,
      inLanguage: "en-GB",
      dateModified: siteMeta.updated,
      isPartOf: { "@id": ids.website },
      mainEntity: { "@id": ids.person },
    },
    websiteNode,
    personNode,
  ]);

export const caseStudyJsonLd = (study: Pick<CaseStudy, "slug" | "name" | "title" | "updated">) => {
  const url = `${origin}/work/${study.slug}`;
  return serialize([
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: `${study.name} case study · ${siteMeta.name}`,
      inLanguage: "en-GB",
      dateModified: study.updated,
      isPartOf: { "@id": ids.website },
      author: { "@id": ids.person },
      about: { "@type": "CreativeWork", name: study.title },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 2, name: `${study.name} case study`, item: url },
      ],
    },
    websiteNode,
    personNode,
  ]);
};

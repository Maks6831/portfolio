import type { MetadataRoute } from "next";
import { siteMeta } from "@/content/site";
import { caseStudies } from "@/content/work";

// Fixed dates from content so the sitemap is stable between builds (never `new Date()`).
export default function sitemap(): MetadataRoute.Sitemap {
  const studies = Object.values(caseStudies);
  // The home page changes on its own and whenever a case study it links to does: take the later date.
  const homeUpdated = [siteMeta.updated, ...studies.map((s) => s.updated)].sort().at(-1);

  return [
    { url: siteMeta.origin, lastModified: homeUpdated },
    ...studies.map((s) => ({
      url: `${siteMeta.origin}/work/${s.slug}`,
      lastModified: s.updated,
    })),
  ];
}

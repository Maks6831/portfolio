import { siteMeta } from "@/content/site";
import { ogCard, ogSize } from "@/lib/og-card";

export const alt = siteMeta.imageAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogCard({ title: siteMeta.name, subtitle: siteMeta.role, line: siteMeta.imageLine });
}

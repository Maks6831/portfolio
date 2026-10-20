import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// DESIGN.md font sizes are custom `text-*` utilities; tell tailwind-merge they are
// sizes, not colors, so `text-body text-white` keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "display-mobile",
            "heading",
            "subheading",
            "body",
            "caption",
            "eyebrow",
            "code",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** An internal route such as "/work/simply-happy" or "/#about", which ButtonLink and ProofTile render with
 * `next/link`. Excludes protocol-relative "//host" URLs, which leave the site, and static files such as
 * "/file.pdf" (a path whose last segment has a file extension), which are not routes. */
export function isRoute(href: string) {
  const path = href.split(/[?#]/, 1)[0];
  return href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+$/i.test(path);
}

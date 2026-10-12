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

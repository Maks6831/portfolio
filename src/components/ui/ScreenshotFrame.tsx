import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/app/lib/utils";

/** Two columns from md, capped near the 1200px container at xl; full width below md. */
export const defaultScreenshotSizes = "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sizes?: string;
  /** Replaces the default `next/image` inside the aspect-ratio box; the viewer island passes a stateful one. */
  image?: ReactNode;
  /** Wraps the frame (title bar and image, never the caption), e.g. in the viewer's link. */
  wrapFrame?: (frame: ReactNode) => ReactNode;
  /** Below md the frame drops its side borders and corners so it can run edge to edge (the caller adds the margins). */
  bleed?: boolean;
};

/**
 * DESIGN.md screenshot frame: a bezel panel with a line border, a 26px title bar (three 8px rings and the file name),
 * the image at its own ratio and a caption strip with an accent dot. The bezel keeps the box (and its ratio) if the
 * image fails, and the caption stays either way. Every caption begins "Test data." (admin) or "Live site." (public pages); the content type enforces it.
 */
const ScreenshotFrame = ({ src, width, height, alt, caption, sizes, image, wrapFrame, bleed }: Props) => {
  const filename = src.split("/").pop() ?? src;
  const frame = (
    <div>
      <div
        aria-hidden="true"
        className="flex h-[26px] items-center gap-1.5 border-b border-line px-2.5 font-mono text-[12px] uppercase leading-none tracking-[0.12em] text-muted"
      >
        <span className="h-2 w-2 rounded-full border border-line" />
        <span className="h-2 w-2 rounded-full border border-line" />
        <span className="h-2 w-2 rounded-full border border-line" />
        <span className="ml-auto text-[11px] normal-case tracking-[0.04em]">{filename}</span>
      </div>
      <div className="bg-bezel" style={{ aspectRatio: `${width} / ${height}` }}>
        {image ?? (
          <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            sizes={sizes ?? defaultScreenshotSizes}
            className="h-auto w-full"
          />
        )}
      </div>
    </div>
  );
  return (
    <figure
      data-shot=""
      className={cn("m-0 overflow-hidden rounded-md border border-line bg-bezel", bleed && "max-md:rounded-none max-md:border-x-0")}
    >
      {wrapFrame ? wrapFrame(frame) : frame}
      <figcaption className="border-t border-line px-3 py-2.5 font-mono text-[12px] leading-normal text-text-secondary before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent before:align-middle">
        {caption}
      </figcaption>
    </figure>
  );
};

export default ScreenshotFrame;

import Image from "next/image";
import type { ReactNode } from "react";

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
  /** Wraps the browser-chrome frame (never the caption), e.g. in the viewer's thumbnail button. */
  wrapFrame?: (frame: ReactNode) => ReactNode;
};

/** Browser-chrome frame around a screenshot. The surface background keeps the box (and aspect ratio) if the image fails. */
const ScreenshotFrame = ({ src, width, height, alt, caption, sizes, image, wrapFrame }: Props) => {
  const frame = (
    <div className="overflow-hidden rounded border border-border bg-surface">
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-border bg-surface-raised px-3 py-2.5"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
      </div>
      <div className="bg-surface" style={{ aspectRatio: `${width} / ${height}` }}>
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
    <figure className="m-0">
      {wrapFrame ? wrapFrame(frame) : frame}
      <figcaption className="mt-3 text-caption text-text-muted">{caption}</figcaption>
    </figure>
  );
};

export default ScreenshotFrame;

import Image from "next/image";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sizes?: string;
};

/** Browser-chrome frame around a screenshot. The surface background keeps the box (and aspect ratio) if the image fails. */
const ScreenshotFrame = ({ src, width, height, alt, caption, sizes }: Props) => (
  <figure className="m-0">
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
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes={sizes ?? "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"}
          className="h-auto w-full"
        />
      </div>
    </div>
    <figcaption className="mt-3 text-caption text-text-muted">{caption}</figcaption>
  </figure>
);

export default ScreenshotFrame;

"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

import ScreenshotFrame, { defaultScreenshotSizes } from "@/components/ui/ScreenshotFrame";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  sizes?: string;
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-4";

/** The optimised 1920w image: the link target without JavaScript, and what the viewer requests when it opens. */
const largeUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;

/** The screenshot, or, once the file has failed to load, the alt text on a bezel box of the same ratio. */
function Shot({
  failed,
  onError,
  src,
  width,
  height,
  alt,
  sizes,
}: Pick<Props, "src" | "width" | "height" | "alt" | "sizes"> & { failed: boolean; onError: () => void }) {
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full items-center justify-center bg-bezel p-4 text-center font-mono text-[12px] text-text-secondary"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {alt}
      </div>
    );
  }
  return <Image src={src} width={width} height={height} alt={alt} sizes={sizes} className="h-auto w-full" onError={onError} />;
}

/** True only for a pointer event on the backdrop: the dialog is the target and the point lies outside its box. */
const hitsBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target !== event.currentTarget) return false;
  const r = event.currentTarget.getBoundingClientRect();
  return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
};

/**
 * Screenshot frame whose image is a link to the 1920w image, so it works without JavaScript. With JavaScript a plain
 * click opens the image in a native modal dialog instead (modified clicks keep the link). Escape, the Close button and a
 * backdrop click close it and focus returns to the link. The dialog body mounts only while open, so the large image is
 * requested only then.
 */
export default function ScreenshotViewer({ src, width, height, alt, caption, sizes }: Props) {
  const [open, setOpen] = useState(false);
  // The frame's image and the large view are different requests, so each tracks its own failure.
  const [thumbFailed, setThumbFailed] = useState(false);
  const [largeFailed, setLargeFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLAnchorElement>(null);
  const downOnBackdrop = useRef(false);
  const captionId = useId();
  const filename = src.split("/").pop();

  // showModal() after the body has rendered so the browser's initial focus lands on the Close button, the first
  // focusable element. Browsers without showModal keep the dialog closed and the link works as a plain link.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (typeof dialog?.showModal === "function") dialog.showModal();
    else setOpen(false);
  }, [open]);

  const close = () => dialogRef.current?.close();
  // Close only when both the press and the release landed on the backdrop, so a drag that starts on the content ends
  // without dismissing the view.
  const onPointerDown = (event: MouseEvent<HTMLDialogElement>) => {
    downOnBackdrop.current = hitsBackdrop(event);
  };
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (downOnBackdrop.current && hitsBackdrop(event)) close();
    downOnBackdrop.current = false;
  };
  // `close` fires for Escape and close() alike; do not rely on the browser to restore focus.
  const onClose = () => {
    setOpen(false);
    openerRef.current?.focus();
  };
  const onOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof HTMLDialogElement === "undefined" || !dialogRef.current?.showModal) return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <ScreenshotFrame
        bleed
        src={src}
        width={width}
        height={height}
        alt={alt}
        caption={caption}
        sizes={sizes}
        image={
          <Shot
            failed={thumbFailed}
            onError={() => setThumbFailed(true)}
            src={src}
            width={width}
            height={height}
            alt={alt}
            sizes={sizes ?? defaultScreenshotSizes}
          />
        }
        wrapFrame={(frame) => (
          <a
            ref={openerRef}
            href={largeUrl(src)}
            aria-label={`Open larger view: ${alt}`}
            onClick={onOpen}
            className={`block cursor-zoom-in text-inherit no-underline ${focusRing}`}
          >
            {frame}
          </a>
        )}
      />
      <dialog
        ref={dialogRef}
        aria-labelledby={captionId}
        onPointerDown={onPointerDown}
        onClick={onClick}
        onClose={onClose}
        className="m-auto max-h-[calc(100svh-40px)] max-w-[calc(100vw-40px)] overflow-auto rounded-md border border-line bg-bezel p-0 text-text backdrop:bg-scrim"
      >
        {open ? (
          <>
            <div className="flex h-11 items-center justify-between border-b border-line pl-3.5 font-mono text-[12px] tracking-[0.08em] text-muted">
              <span>{filename} · 1920w</span>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className={`inline-flex h-11 w-11 items-center justify-center border-l border-line bg-transparent text-[26px] leading-none text-text ${focusRing}`}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div
              style={{
                aspectRatio: `${width} / ${height}`,
                // The whole image on screen: never wider than the dialog's room, never taller than what is left
                // under the 44px header and the caption.
                width: `min(1920px, 100vw - 42px, (100svh - 150px) * ${(width / height).toFixed(4)})`,
              }}
            >
              <Shot
                failed={largeFailed}
                onError={() => setLargeFailed(true)}
                src={src}
                width={width}
                height={height}
                alt={alt}
                sizes="100vw"
              />
            </div>
            <p
              id={captionId}
              className="m-0 border-t border-line px-3.5 py-3 font-mono text-[12px] leading-normal text-text-secondary before:mr-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent before:align-middle"
            >
              {caption}
            </p>
          </>
        ) : null}
      </dialog>
    </>
  );
}

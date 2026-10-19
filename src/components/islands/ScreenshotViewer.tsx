"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { IoClose } from "react-icons/io5";

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
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

/** The screenshot, or a neutral placeholder of the same aspect ratio once the file has failed to load. */
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
        aria-label={`${alt} (image unavailable)`}
        className="flex w-full items-center justify-center bg-surface p-4 text-center text-caption text-text-muted"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        Image unavailable
      </div>
    );
  }
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      sizes={sizes}
      className="h-auto w-full"
      onError={onError}
    />
  );
}

/** True only for a pointer event on the backdrop: the dialog is the target and the point lies outside its box. */
const hitsBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target !== event.currentTarget) return false;
  const r = event.currentTarget.getBoundingClientRect();
  return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
};

/**
 * Framed thumbnail that opens a larger view in a native modal dialog. Escape, the close button
 * and a backdrop click all close it, and focus returns to the thumbnail. The dialog body mounts
 * only while open, so the static HTML carries one image per screenshot.
 */
export default function ScreenshotViewer({ src, width, height, alt, caption, sizes }: Props) {
  const [open, setOpen] = useState(false);
  // The thumbnail and the large view are different requests, so each tracks its own failure.
  const [thumbFailed, setThumbFailed] = useState(false);
  const [largeFailed, setLargeFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const downOnBackdrop = useRef(false);

  // showModal() after the body has rendered so the browser's initial focus lands on the close button.
  // Browsers without showModal (Safari before 15.4) keep the dialog closed instead of throwing.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (typeof dialog?.showModal === "function") dialog.showModal();
    else setOpen(false);
  }, [open]);

  const close = () => dialogRef.current?.close();
  // Close only when both the press and the release landed on the backdrop, so a drag that starts on
  // the content (or on the dialog's own scrollbar) and ends outside does not dismiss the view.
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

  return (
    <>
      <ScreenshotFrame
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
          <button
            ref={openerRef}
            type="button"
            aria-haspopup="dialog"
            disabled={thumbFailed}
            aria-disabled={thumbFailed}
            onClick={() => setOpen(true)}
            className={`block w-full cursor-zoom-in rounded text-left disabled:cursor-default ${focusRing}`}
          >
            {frame}
            <span className="sr-only">. Open larger view</span>
          </button>
        )}
      />
      <dialog
        ref={dialogRef}
        aria-label={`Larger view: ${caption}`}
        onPointerDown={onPointerDown}
        onClick={onClick}
        onClose={onClose}
        className="m-auto max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] rounded border border-border bg-surface p-0 text-text-primary backdrop:bg-background/80"
      >
        {open ? (
          <div className="flex flex-col gap-4 p-4 md:p-6">
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className={`inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-accent motion-reduce:transition-none ${focusRing}`}
              >
                <IoClose aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div
              className="bg-surface"
              style={{
                aspectRatio: `${width} / ${height}`,
                // Fit the whole image on screen: inside the dialog's own max width, padding and border,
                // and never taller than what is left under the header.
                width: `min(1400px, 100vw - 6rem, (100vh - 12rem) * ${(width / height).toFixed(4)})`,
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
            <p className="max-w-[68ch] text-caption text-text-muted">{caption}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

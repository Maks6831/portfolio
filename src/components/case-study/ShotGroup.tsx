import ScreenshotViewer from "@/components/islands/ScreenshotViewer";
import type { Screenshot } from "@/content/work/types";

type Props = { shots: Screenshot[]; className?: string };

/**
 * A section's captures, one column below md and edge to edge on phones (negative margins match the section padding).
 * Desktop captures are full pages, so they never go three across: two go 2-up at md and from xl and stack at lg, where
 * the body column is only 480-736px; with three, the first spans the row and the other two pair up under it. At lg a
 * group of landscape captures is marked `data-wide` and breaks out of the text measure to the media width (globals.css).
 * The `sizes` strings in the content module describe these slots. Renders nothing when the section has none.
 */
const ShotGroup = ({ shots, className = "" }: Props) => {
  if (!shots.length) return null;
  const wide = shots.every((shot) => shot.width > shot.height);
  const cols = shots.length >= 2 ? "md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : "";
  const spanFirst = shots.length % 2 === 1 && shots.length > 1;
  return (
    <ul
      role="list"
      data-shots=""
      data-wide={wide ? "" : undefined}
      className={`m-0 grid list-none grid-cols-1 gap-tile-gap p-0 max-md:-mx-5 ${cols} ${className}`}
    >
      {shots.map((shot, i) => (
        <li
          key={shot.src}
          className={
            shot.height > shot.width ? "md:max-w-[384px]" : spanFirst && i === 0 ? "md:col-span-2 lg:col-span-1 xl:col-span-2" : undefined
          }
        >
          <ScreenshotViewer {...shot} />
        </li>
      ))}
    </ul>
  );
};

export default ShotGroup;

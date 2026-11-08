import ScreenshotViewer from "@/components/islands/ScreenshotViewer";
import type { Screenshot } from "@/content/work/types";

type Props = { shots: Screenshot[]; className?: string };

/**
 * A section's captures: 2-up or 3-up from md at the tile gap, one column below, edge to edge on phones (negative
 * margins match the section padding). The count decides the columns, so the content module only says which section
 * a capture belongs in. Renders nothing when the section has none.
 */
const ShotGroup = ({ shots, className = "" }: Props) => {
  if (!shots.length) return null;
  const cols = shots.length >= 3 ? "md:grid-cols-3" : shots.length === 2 ? "md:grid-cols-2" : "";
  return (
    <ul
      role="list"
      data-shots=""
      className={`m-0 grid list-none grid-cols-1 gap-tile-gap p-0 max-md:-mx-5 ${cols} ${className}`}
    >
      {shots.map((shot) => (
        <li key={shot.src} className={shot.height > shot.width ? "md:max-w-[384px]" : undefined}>
          <ScreenshotViewer {...shot} />
        </li>
      ))}
    </ul>
  );
};

export default ShotGroup;

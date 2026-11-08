/** Home counter chip "©2026 · 0n / 03" (EXPERIENCE.md HUD label). Decorative; shown only in stack mode, where each
 * surface ends in one that sticks to the bottom of the viewport, so the counter steps with no JS. */
export default function Counter({ n }: { n: 1 | 2 | 3 }) {
  return (
    <div className="ctr-wrap" aria-hidden="true">
      <span className="ctr">
        ©2026 · <b>{`0${n}`}</b> / 03
      </span>
    </div>
  );
}

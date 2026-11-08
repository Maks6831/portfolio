"use client";
import { useEffect, useState } from "react";

// HUD London clock (EXPERIENCE.md Live clock). The server renders the empty reserved box; time is set only in
// useEffect. HH:MM:SS for 5 s after hydration, then HH:MM; HH:MM throughout under reduced motion. Stops while hidden.
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default function LiveClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const until = Date.now() + 5000;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const n = Date.now();
      const s = !q.matches && n < until;
      const x = fmt.format(n);
      setT(s ? x : x.slice(0, 5));
      id = setTimeout(tick, s ? 1000 - (n % 1000) : 60000 - (n % 60000));
    };
    const run = () => {
      clearTimeout(id);
      if (!document.hidden) tick();
    };
    run();
    q.addEventListener("change", run);
    document.addEventListener("visibilitychange", run);
    return () => {
      clearTimeout(id);
      q.removeEventListener("change", run);
      document.removeEventListener("visibilitychange", run);
    };
  }, []);
  return (
    <span className="hud-clock" aria-hidden="true" suppressHydrationWarning>
      {t}
    </span>
  );
}

"use client";

import { useState, useSyncExternalStore } from "react";

// "Copy email" (EXPERIENCE.md Copy-email status). The <button> is not rendered until hydration (the "Email me" mailto
// covers no-JS). The role="status" line is in the DOM, empty at load, and set after copying; a repeat press clears it
// first so it re-announces. If the Clipboard API fails the address text is selected and the status says so. No toast,
// no timeout.
export default function CopyEmail({ email }: { email: string }) {
  // false on the server and during hydration, true afterwards: the button is not rendered before its island hydrates.
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [msg, setMsg] = useState("");
  if (!ready) return null;

  const say = (text: string) => {
    setMsg("");
    setTimeout(() => setMsg(text), 60);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      say(`Email copied · ${email}`);
    } catch {
      const el = document.getElementById("contact-email");
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(r);
      }
      say("Address selected, press Ctrl+C or Cmd+C to copy");
    }
  };

  return (
    <>
      <button type="button" onClick={copy} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-accent px-5 py-3.5 text-sm font-semibold leading-none text-accent hover:border-accent-pressed hover:text-accent-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-focus-ring">
        Copy email
      </button>
      <span role="status" className="order-last block min-h-[1.5em] basis-full font-mono text-xs tracking-[0.06em] text-accent">
        {msg}
      </span>
    </>
  );
}

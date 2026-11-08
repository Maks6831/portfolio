"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "failed";

export default function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded border border-accent px-7 text-sm font-semibold text-accent transition-colors hover:border-accent-pressed hover:text-accent-pressed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring motion-reduce:transition-none"
      >
        {status === "copied" ? "Email copied" : "Copy email"}
      </button>
      {status === "failed" && (
        <span className="select-all text-sm text-text-secondary">{email}</span>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Email copied"
          : status === "failed"
            ? "Copy failed. The address is shown below to copy by hand."
            : ""}
      </span>
    </div>
  );
}

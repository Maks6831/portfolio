import type { ReactNode } from "react";

/** CSS laptop (DESIGN.md Laptop frame): bezel, screen at 16:10 holding the image, gradient base. Below lg the CSS drops
 * the bezel and base so the same image box becomes the full-bleed phone slot. Styles live in src/app/home.css. */
export default function LaptopFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className ? `laptop ${className}` : "laptop"}>
      <div className="laptop-screen">{children}</div>
      <div className="laptop-base" aria-hidden="true" />
    </div>
  );
}

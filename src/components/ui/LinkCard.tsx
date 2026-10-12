import Link from "next/link";
import { cn } from "@/app/lib/utils";

/** CSS-only linked card (replaces the framer-motion 3D pin). */
export const LinkCard = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-2xl border border-white/[0.1] bg-black p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] transition duration-300 hover:-translate-y-1 hover:border-white/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring",
        className
      )}
    >
      {children}
    </Link>
  );
};

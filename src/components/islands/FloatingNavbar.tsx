"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

type NavItem = { name: string; link: string };

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  // visible in the hero; hides on scroll down, returns on scroll up
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    // sync once after mount so a restored mid-page scroll position is respected
    const raf = window.requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(max <= 0 || window.scrollY / max < 0.05);
    });
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0 || y / max < 0.05 || y < last) {
        setVisible(true);
      } else if (y > last) {
        setVisible(false);
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      inert={!visible}
      className={cn(
        "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-10 py-5 rounded-lg border border-white/10 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4 transition-[transform,opacity,visibility] duration-200 motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "invisible -translate-y-24 opacity-0",
        className
      )}
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        borderRadius: "12px",
      }}
    >
      {navItems.map((navItem) => (
        <Link
          key={navItem.link}
          href={navItem.link}
          className="relative flex items-center text-sm text-neutral-50 hover:text-neutral-300"
        >
          {navItem.name}
        </Link>
      ))}
    </nav>
  );
};

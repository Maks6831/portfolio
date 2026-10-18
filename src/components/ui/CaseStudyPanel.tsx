import { cn } from "@/app/lib/utils";

type Props = {
  heading: string;
  /** Heading level inside the page outline. The Summary and What I owned panels sit under an h2. */
  level?: "h3" | "h4";
  /** Small tracked caps above the heading. */
  eyebrow?: string;
  /** 2 to 4 lines of prose. */
  children: string;
  /** Use "primary" for the claim a reader should take away (the After panel). */
  tone?: "primary" | "secondary";
  className?: string;
};

/** DESIGN.md case-study panel: a surface tile with a hairline border holding a heading and short prose. */
const CaseStudyPanel = ({
  heading,
  level: Heading = "h3",
  eyebrow,
  children,
  tone = "secondary",
  className,
}: Props) => (
  <div className={cn("h-full rounded-card border border-border bg-surface p-7", className)}>
    {eyebrow ? <p className="text-eyebrow uppercase text-accent">{eyebrow}</p> : null}
    <Heading className={cn("text-body font-semibold text-text-primary", eyebrow && "mt-2")}>{heading}</Heading>
    <p
      className={cn(
        "mt-3 max-w-[68ch] text-body",
        tone === "primary" ? "text-text-primary" : "text-text-secondary"
      )}
    >
      {children}
    </p>
  </div>
);

export default CaseStudyPanel;

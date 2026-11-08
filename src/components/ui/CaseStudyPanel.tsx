import { cn } from "@/app/lib/utils";

type Props = {
  heading: string;
  /** Heading level inside the page outline. The cards sit under an h2. */
  level?: "h3" | "h4";
  /** 2 to 4 lines of prose. */
  children: string;
  className?: string;
};

/** DESIGN.md content card: a hairline-bordered block holding a heading and short prose (owned and reliability cards). */
const CaseStudyPanel = ({ heading, level: Heading = "h3", children, className }: Props) => (
  <div className={cn("h-full rounded-md border border-line p-[18px]", className)}>
    <Heading className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-text">{heading}</Heading>
    <p className="mt-2 max-w-[68ch] text-[14px] leading-[1.45] text-text-secondary">{children}</p>
  </div>
);

export default CaseStudyPanel;

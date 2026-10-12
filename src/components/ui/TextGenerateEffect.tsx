import { cn } from "@/app/lib/utils";

/** Word-by-word fade-in, pure CSS (disabled under reduced motion). */
export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="text-white leading-snug tracking-wide">
          <div>
            {wordsArray.map((word, idx) => (
              <span
                key={word + idx}
                className={cn(
                  "opacity-0 animate-fade-in motion-reduce:animate-none motion-reduce:opacity-100",
                  idx > 3 ? "text-purple" : "text-white"
                )}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";
import { countSample } from "@/maths/sampling";

type Props = {
  marbles: boolean[];
  sampleNumber: number;
  isNew?: boolean;
  isFading?: boolean;
};

export function MarbleRow({
  marbles,
  sampleNumber,
  isNew = false,
  isFading = false,
}: Props) {
  const count = countSample(marbles);
  return (
    <div
      className={`flex items-center gap-[8px] py-1 sm:gap-[10px] ${isFading ? "animate-slide-out-down" : ""} ${isNew ? "animate-slide-down" : ""}`}
    >
      {/* Label */}
      <span className="w-[56px] shrink-0 whitespace-nowrap text-right text-[10px] text-foreground/40 tabular-nums sm:w-[68px] sm:text-[11px]">
        #{sampleNumber}
      </span>

      {/* Marble dots */}
      <div className="flex shrink-0 gap-[2px] sm:gap-[3px]">
        {marbles.map((isHit, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold sm:h-[22px] sm:w-[22px] sm:text-[9px] ${isNew ? "animate-pop-in" : ""
              } ${isHit
                ? "bg-green-600 text-white"
                : "border border-foreground/[0.18] text-foreground/25"
              }`}
          >
            {isHit && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[3px] top-[2px] h-[3px] w-[5px] -rotate-[30deg] rounded-full bg-white/40 sm:left-[4px] sm:top-[3px] sm:h-[4px] sm:w-[6px]"
              />
            )}
            {isHit ? "✓" : "✗"}
          </div>
        ))}
      </div>

      {/* Hit count */}
      <span
        className={`w-8 shrink-0 text-[12px] font-semibold tabular-nums sm:w-9 sm:text-[13px] ${count > 0 ? "text-green-600" : "text-foreground/35"
          }`}
      >
        {count}/{marbles.length}
      </span>
    </div>
  );
}

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
      className={`flex items-center gap-[10px] py-1 transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"
        } ${isNew ? "animate-slide-down" : ""}`}
    >
      {/* Label */}
      <span className="w-[68px] shrink-0 whitespace-nowrap text-right text-[11px] text-foreground/40 tabular-nums">
        #{sampleNumber}
      </span>

      {/* Marble dots */}
      <div className="flex shrink-0 gap-[3px]">
        {marbles.map((converted, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`relative flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${isNew ? "animate-pop-in" : ""
              } ${converted
                ? "bg-green-600 text-white"
                : "border border-foreground/[0.18] text-foreground/25"
              }`}
          >
            {converted && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[4px] top-[3px] h-[4px] w-[6px] -rotate-[30deg] rounded-full bg-white/40"
              />
            )}
            {converted ? "✓" : "✗"}
          </div>
        ))}
      </div>

      {/* Hit count */}
      <span
        className={`w-9 shrink-0 text-[13px] font-semibold tabular-nums ${count > 0 ? "text-green-600" : "text-foreground/35"
          }`}
      >
        {count}/{marbles.length}
      </span>
    </div>
  );
}

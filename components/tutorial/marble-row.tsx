type Props = {
  marbles: boolean[];
  sampleNumber: number;
  isFirst?: boolean;
  isFading?: boolean;
};

export function MarbleRow({
  marbles,
  sampleNumber,
  isFirst = false,
  isFading = false,
}: Props) {
  const count = marbles.filter(x => x === true).length;

  return (
    <div
      className={`flex items-center gap-2 py-1 transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"
        }`}
    >
      <span className="w-16 shrink-0 text-right text-xs text-foreground/50">
        Sample {sampleNumber}
      </span>

      {/* Marble strip — relative so the mean line can be absolutely positioned */}
      <div className="relative shrink-0">
        <div
          className="pointer-events-none absolute inset-y-0 border-l border-dashed border-foreground/40 opacity-70"
          style={{ left: "20%" }}
          aria-hidden="true"
        >
          {isFirst && (
            <span className="absolute bottom-full left-1 whitespace-nowrap pb-0.5 text-[10px] text-foreground/40">
              average: 2
            </span>
          )}
        </div>

        <div className="flex gap-1">
          {marbles.map((converted, i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${converted
                  ? "bg-green-500 text-white"
                  : "border border-foreground/20 text-foreground/30"
                }`}
            >
              {converted ? "✓" : "✗"}
            </div>
          ))}
        </div>
      </div>

      <span className="w-10 shrink-0 text-xs tabular-nums text-foreground/60">
        {count} / 10
      </span>
    </div>
  );
}

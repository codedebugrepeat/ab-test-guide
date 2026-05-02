export function ExperimentIllustration() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 flex-col items-center gap-3 rounded-md border border-foreground/15 bg-foreground/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Version A
        </p>
        <div className="w-full rounded border border-foreground/15 bg-background px-4 py-2 text-center text-sm font-medium text-foreground/80">
          Start your free trial
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3 rounded-md border border-foreground/15 bg-foreground/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Version B
        </p>
        <div className="w-full rounded border border-foreground/15 bg-background px-4 py-2 text-center text-sm font-medium text-foreground/80">
          Get started for free
        </div>
      </div>
    </div>
  );
}

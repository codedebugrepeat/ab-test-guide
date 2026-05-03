export function ExperimentIllustration() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 flex-col gap-2 rounded-md border border-foreground/15 bg-foreground/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Version A
        </p>
        <p className="text-base font-medium text-foreground">
          &ldquo;Start your free trial&rdquo;
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-md border border-foreground/15 bg-foreground/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Version B
        </p>
        <p className="text-base font-medium text-foreground">
          &ldquo;Get started for free&rdquo;
        </p>
      </div>
    </div>
  );
}

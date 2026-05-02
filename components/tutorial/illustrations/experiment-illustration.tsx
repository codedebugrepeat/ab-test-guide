export function ExperimentIllustration() {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 flex-col items-center gap-3 rounded-md border border-blue-300 bg-blue-50 px-5 py-4 dark:border-blue-700 dark:bg-blue-950/40">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
          Version A
        </p>
        <div className="w-full rounded border border-blue-300 bg-white px-4 py-2 text-center text-sm font-medium text-blue-800 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
          Start your free trial
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3 rounded-md border border-green-300 bg-green-50 px-5 py-4 dark:border-green-700 dark:bg-green-950/40">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
          Version B
        </p>
        <div className="w-full rounded border border-green-300 bg-white px-4 py-2 text-center text-sm font-medium text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200">
          Get started for free
        </div>
      </div>
    </div>
  );
}

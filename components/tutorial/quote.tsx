export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-6 border-l-4 border-foreground/30 pl-5 text-xl font-bold italic text-foreground/70 sm:text-2xl">
      {children}
    </blockquote>
  );
}

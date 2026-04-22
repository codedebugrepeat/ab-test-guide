import type { ReactNode } from "react";
import { TutorialNav } from "./tutorial-nav";

export function TutorialLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="flex gap-12">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-8">
            <TutorialNav />
          </div>
        </aside>
      </div>
    </div>
  );
}

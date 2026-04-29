"use client";

import { useState, useRef, useEffect } from "react";
import { vocabulary } from "@/components/tutorial/constants/vocabulary";

interface SideRemarkProps {
  term: string;
}

export function SideRemark({ term }: SideRemarkProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const description = vocabulary[term];

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline">
      {" "}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Stats aside for "${term}"`}
        className="inline cursor-pointer"
      >
        <strong className="text-accent">{term}</strong>
        <span
          className="ml-0.5 inline-flex items-center justify-center rounded-full border border-accent/50 text-accent transition-colors hover:border-accent hover:text-accent"
          style={{ width: "1em", height: "1em", fontSize: "0.7em", verticalAlign: "super" }}
          aria-hidden="true"
        >
          i
        </span>
      </button>{" "}
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 block w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-foreground/15 bg-background px-4 py-3 text-sm text-foreground/70 shadow-lg"
        >
          {description}
        </span>
      )}
    </span>
  );
}

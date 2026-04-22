import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";

export const metadata: Metadata = {
  title: "How Many Visitors Do You Need?",
  description:
    "Before you can know how many visitors you need, you need to know your baseline. This chapter explains why baseline rate is the starting point for every sample size calculation.",
};

export default function Section2Page() {
  return (
    <TutorialLayout>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        How many visitors do you need?
      </h1>
      <p className="mt-4 text-lg text-foreground/70">
        It depends on your baseline. This chapter is coming soon.
      </p>
    </TutorialLayout>
  );
}

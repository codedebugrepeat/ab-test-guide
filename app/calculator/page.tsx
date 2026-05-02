import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CalculatorWidget } from "@/components/tutorial/widgets/calculator-widget";
import { AuthorCalloutInline } from "@/components/tutorial/author-callout";

export const metadata: Metadata = {
  title: "A/B Test Sample Size Calculator",
  description:
    "How many users do you need for your experiment? A pre-experiment calculator that turns baseline, lift, and confidence into a sample size.",
};

export default function CalculatorPage() {
  return (
    <Container>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        The finale
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        A/B test sample size calculator
      </h1>
      <p className="mt-6 text-lg text-foreground/70">
        How many users do you need for your experiment?
      </p>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>A quick recap of what shapes that number:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Link
              href="/why-small-samples-lie"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Chapter 1
            </Link>{" "}
            — small samples lie. You probably need more users than you think.
          </li>
          <li>
            <Link
              href="/your-baseline-matters"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Chapter 2
            </Link>{" "}
            — your baseline matters. The lower it is, the more data you need.
          </li>
          <li>
            <Link
              href="/how-big-a-jump-are-you-looking-for"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Chapter 3
            </Link>{" "}
            — lift matters. Aim for a smaller win and the required sample size
            explodes.
          </li>
          <li>
            <Link
              href="/how-sure-do-you-need-to-be"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Chapter 4
            </Link>{" "}
            — confidence matters. A stricter threshold means you need more
            visitors to clear it.
          </li>
        </ul>
        <p>
          Those four levers come together here. Plug them in as inputs and the
          calculator gives you the minimum sample size you need per variant.
        </p>
        <p>
          This is a <strong>pre-experiment</strong> calculator. It helps you
          plan how many visitors you need before you launch, so your results
          have a fair shot at being statistically significant.
        </p>
      </div>

      <div className="mt-10">
        <CalculatorWidget />
      </div>

      <div className="mt-10 space-y-4 text-foreground/70">
        <p>
          Set your baseline conversion, the smallest effect worth detecting, and
          your confidence level. The visitors-per-variant number tells you how
          many people each side of your test needs before the math can reliably
          tell A from B.
        </p>
        <p>
          Halve the lift and the required visitors roughly quadruple. Push
          confidence from 95% to 99% and the threshold slides further out, so
          you need more visitors to clear it. The relationships you&apos;ve been
          reading off the chart now have numbers attached.
        </p>
      </div>

      <AuthorCalloutInline />
    </Container>
  );
}

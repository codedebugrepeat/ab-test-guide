import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Calculator",
  description:
    "Plan your A/B test sample size or check whether your results are significant.",
};

export default function CalculatorPage() {
  return (
    <Container>
      <h1 className="text-3xl font-semibold tracking-tight">Calculator</h1>
      <p className="mt-4 text-foreground/70">
        The sample-size and significance calculator will live here.
      </p>
    </Container>
  );
}

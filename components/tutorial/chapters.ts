export const chapters = [
  {
    href: "/why-small-samples-lie",
    number: 1,
    title: "Why small samples lie",
    shortTitle: "Small samples",
    browserTitle: "Why small samples lie",
    description:
      "A hands-on guide to A/B testing with interactive visualizations. Start here: why small samples produce results you can't trust, and what sampling error really looks like.",
  },
  {
    href: "/your-baseline-matters",
    number: 2,
    title: "Your baseline matters",
    shortTitle: "Baseline",
    browserTitle: "Your baseline matters",
    description:
      "Before you can know how many visitors you need, you need to know your baseline. This chapter explains why baseline rate is the starting point for every sample size calculation.",
  },
  {
    href: "/how-big-a-jump-are-you-looking-for",
    number: 3,
    title: "How big a jump are you looking for?",
    shortTitle: "Effect size",
    browserTitle: "How big a jump are you looking for?",
    description:
      "The minimum lift you want to detect is a lever, just like your baseline. Aim small and you need a lot more data. Aim big and the picture separates on its own.",
  },
  {
    href: "/how-sure-do-you-need-to-be",
    number: 4,
    title: "How sure do you need to be?",
    shortTitle: "Confidence",
    browserTitle: "How sure do you need to be?",
    description:
      "Baseline and lift set the picture. The last lever is confidence: how strict do you want to be about calling a winner?",
  },
] as const;

export const totalChapters = chapters.length;

export type Chapter = (typeof chapters)[number];

export function getChapter(number: Chapter["number"]): Chapter {
  const chapter = chapters.find((c) => c.number === number);
  if (!chapter) throw new Error(`Unknown chapter number: ${number}`);
  return chapter;
}

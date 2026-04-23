export const chapters = [
  {
    href: "/why-you-cant-trust-your-experiment",
    number: 1,
    title: "Why small samples lie",
    shortTitle: "Small samples",
    browserTitle: "Why small samples lie",
    description:
      "A hands-on guide to A/B testing with interactive visualizations. Start here: why small samples produce results you can't trust, and what sampling error really looks like.",
  },
  {
    href: "/how-many-visitors-do-you-need",
    number: 2,
    title: "How many visitors do you need?",
    shortTitle: "Sample size",
    browserTitle: "How many visitors do you need?",
    description:
      "Before you can know how many visitors you need, you need to know your baseline. This chapter explains why baseline rate is the starting point for every sample size calculation.",
  },
] as const;

export const totalChapters = chapters.length;

export type Chapter = (typeof chapters)[number];

export function getChapter(number: number): Chapter {
  const chapter = chapters.find((c) => c.number === number);
  if (!chapter) throw new Error(`Unknown chapter number: ${number}`);
  return chapter;
}

export const siteConfig = {
  name: "A/B Test Guide",
  description:
    "A visual, interactive guide to A/B testing that assumes no prior knowledge — and at the end, you can run a real test and trust the result.",
  url: "https://ab-test-guide.example.com",
  githubUrl: "https://github.com/codedebugrepeat/ab-test-guide",
  navLinks: [
    { href: "/", label: "Tutorial" },
    { href: "/calculator", label: "Calculator" },
  ],
  author: {
    name: "Christoph Krenn",
    url: "https://www.linkedin.com/in/christoph-krenn/",
    "role": "Product Manager & builder",
    image: "/assets/christoph.jpeg",
    bio: "I'm a Product Manager and builder with a love for data analytics. Most A/B testing guides assume prior knowledge. So I built this guide & calculator as a beginner-friendly alternative. It's open source and free - I hope you enjoy it."
  }
} as const;

export type SiteConfig = typeof siteConfig;

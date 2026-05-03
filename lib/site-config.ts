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
    bio: "As a Product Manager and builder, I found that most A/B testing resources are too complex for beginners. I created this interactive guide and calculator to provide a simple, fun alternative. I hope it helps you get started!"
  }
} as const;

export type SiteConfig = typeof siteConfig;

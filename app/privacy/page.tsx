import type { Metadata } from "next";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Privacy policy · ${siteConfig.name}`,
  description: "How this site handles your data.",
};

export default function PrivacyPage() {
  return (
    <Container>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Privacy policy
      </h1>
      <p className="mt-2 text-sm text-foreground/60">Last updated: 2026-05-06</p>

      <div className="mt-8 space-y-6 text-foreground/80">
        <p>
          {siteConfig.name} is a free, static guide. The site does not have user
          accounts and does not store any personal information about you. Any
          survey responses you choose to submit are handled by PostHog (see
          below).
        </p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
          Analytics
        </h2>
        <p>
          We use{" "}
          <a
            href="https://posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            PostHog
          </a>{" "}
          to understand how the guide is used so we can improve it. PostHog
          records usage events such as pages viewed and clicks. It may also
          store your IP address to derive an approximate location.
        </p>
        <p>
          If you accept cookies on the consent banner, PostHog sets a
          pseudonymous identifier that lets us recognise return visits and link
          them into a single session. If you decline, PostHog runs in cookieless
          mode and no identifiers are stored on your device.
        </p>
        <p>
          You can change your choice at any time by clearing this site&apos;s
          cookies in your browser. We do not use any other tracking, advertising,
          or third-party cookies.
        </p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
          Contact
        </h2>
        <p>
          Questions? Reach out to{" "}
          <a
            href={siteConfig.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            {siteConfig.author.name}
          </a>
          .
        </p>
      </div>
    </Container>
  );
}

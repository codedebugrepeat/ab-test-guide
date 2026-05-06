"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";

export function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState(
    () => posthog.get_explicit_consent_status() ?? "pending"
  );

  const handleAccept = () => {
    posthog.opt_in_capturing();
    setConsentGiven("granted");
  };

  const handleDecline = () => {
    posthog.opt_out_capturing();
    setConsentGiven("denied");
  };

  if (consentGiven !== "pending") return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-accent px-6 py-4 sm:py-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold text-background">We use cookies</p>
          <p className="text-sm text-background">
            We use tracking cookies to understand how you use the product and help us improve it.{" "}
            <Link href="/privacy" className="underline opacity-80 hover:opacity-100">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-md border border-background/40 px-3 py-1.5 text-sm text-background transition-colors hover:border-background hover:bg-background/10"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-background px-3 py-1.5 text-sm text-accent font-medium transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

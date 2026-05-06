<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the A/B test guide. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new file): Initializes PostHog client-side via the Next.js instrumentation hook. Uses a reverse proxy for better reliability and enables exception capture.
- **`next.config.ts`**: Added reverse proxy rewrites routing `/ingest/*` → `eu.i.posthog.com` and `/ingest/static|array/*` → `eu-assets.i.posthog.com`, plus `skipTrailingSlashRedirect: true`.
- **`.gitignore`**: Added `.env.local` to prevent secrets from being committed. Set `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` (EU instance) in your local `.env.local` to run analytics locally.
- **`components/tutorial/section-footer.tsx`**: Converted to a client component; added `section_next_clicked` event on the next-chapter CTA link.
- **`components/tutorial/tutorial-nav.tsx`**: Added `chapter_nav_clicked` event on all chapter navigation links, with `chapter_number`, `from_href`, and `nav_type` properties.
- **`components/tutorial/widgets/marble-sampling-widget.tsx`**: Added `marble_sample_drawn` event on single and bulk draws, and `marble_samples_reset` on the reset button.
- **`components/tutorial/widgets/calculator-widget.tsx`**: Added `calculator_reset`, `calculator_confidence_changed`, and `calculator_period_changed` events.
- **`components/tutorial/widgets/baseline-distribution-widget.tsx`**: Added debounced `baseline_slider_changed` event piggybacked on the existing live-text debounce.
- **`components/tutorial/widgets/lift-effect-widget.tsx`**: Added debounced `lift_slider_adjusted` event.
- **`components/tutorial/widgets/decision-threshold-widget.tsx`**: Added debounced `decision_threshold_adjusted` event with false-positive and missed-win percentages as properties.

| Event | Description | File |
|---|---|---|
| `marble_sample_drawn` | User draws one or more samples in the marble sampling widget | `components/tutorial/widgets/marble-sampling-widget.tsx` |
| `marble_samples_reset` | User resets all drawn samples in the marble sampling widget | `components/tutorial/widgets/marble-sampling-widget.tsx` |
| `chapter_nav_clicked` | User clicks a chapter link in the tutorial navigation | `components/tutorial/tutorial-nav.tsx` |
| `section_next_clicked` | User clicks the next-chapter CTA at the bottom of a section | `components/tutorial/section-footer.tsx` |
| `calculator_reset` | User resets the sample size calculator to defaults | `components/tutorial/widgets/calculator-widget.tsx` |
| `calculator_confidence_changed` | User selects a confidence level (90%, 95%, 99%) in the calculator | `components/tutorial/widgets/calculator-widget.tsx` |
| `calculator_period_changed` | User changes the time period (day/week/month) in the duration estimator | `components/tutorial/widgets/calculator-widget.tsx` |
| `baseline_slider_changed` | User moves the baseline slider in chapter 2's distribution widget | `components/tutorial/widgets/baseline-distribution-widget.tsx` |
| `lift_slider_adjusted` | User moves the lift slider in the lift effect widget | `components/tutorial/widgets/lift-effect-widget.tsx` |
| `decision_threshold_adjusted` | User moves the confidence slider in the decision threshold widget | `components/tutorial/widgets/decision-threshold-widget.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/172495/dashboard/660589
- **Chapter progression funnel**: https://eu.posthog.com/project/172495/insights/2TpmAf79
- **Widget engagement over time**: https://eu.posthog.com/project/172495/insights/fmFuYM2m
- **Chapter nav clicks by chapter**: https://eu.posthog.com/project/172495/insights/joUzk2Zv
- **Calculator confidence level preference**: https://eu.posthog.com/project/172495/insights/M4WbUaUG
- **Unique users engaging with widgets**: https://eu.posthog.com/project/172495/insights/soIvuYO4

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

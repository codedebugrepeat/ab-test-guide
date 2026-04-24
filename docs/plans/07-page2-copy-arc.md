# Phase 3 — Page 2 copy: wire up the story arc

**Status:** Ready after Phase 2 (Widget 2 must exist before the copy references it).

**Goal:** Restructure `app/how-many-visitors-do-you-need/page.tsx` to match the story arc from `05-section-2-widget-plan.md`. The current page has Widget 1 in Widget 2's slot and is missing the opening, bridge paragraph, and post-widget unpacking. Phase 2 moves Widget 2 into the slot; this phase rearranges the full narrative and places Widget 1 properly.

---

## Target page structure (section by section)

All text below is **draft copy** — apply the writing-like-a-human skill before finalising.

---

### 1. Page header (keep as-is)

```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
  {siteConfig.name} · Chapter {chapter.number} of {totalChapters}
</p>
<h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
  {chapter.title}
</h1>
```

---

### 2. Opening paragraph (replace current intro)

**Current:** "You know small samples lie. So the next question is obvious: how many visitors do you actually need? There's no universal number. It depends on three things…"

**Replace with:** Something that picks up directly from Ch1's ending ("More data tightens that spread. How much more?") and frames the chapter around building the distribution idea.

Draft:
> Small samples are noisy. But how noisy, exactly? That's not a philosophical question — it has a precise answer, and the answer changes depending on your product. The key is your baseline conversion rate: how often visitors convert right now, before you change anything. Let's build some intuition.

Keep the `<hr className="my-10 border-foreground/10" />` after.

---

### 3. Widget 1 — "The shape of noise"

**Add new h2 before Widget 1:**
```tsx
<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
  The shape of noise
</h2>
```

**Add lead-in paragraph:**
> Back to the marble jar. True rate: 20%. Each draw of 10 is a sample, and we've seen those samples jump around. But here's what happens when you draw many samples and track where they land: the noise has structure. Keep drawing and watch the right panel.

**Widget 1 block (currently the page has this widget in Widget 2's position — move it here):**
```tsx
<div className="mt-6">
  <WidgetFrame>
    <SamplingDistributionBuilder />
  </WidgetFrame>
</div>
```

---

### 4. Bridge paragraph

After Widget 1, before "What's a baseline?":

```tsx
<div className="mt-8 space-y-4 text-foreground/70">
  <p>
    What you just drew has a name: a <strong>sampling distribution</strong>. 
    It's the shape of all the outcomes your experiment could produce, 
    drawn from the same truth. Tight shape means consistent samples — 
    you can trust what you measure. Wide shape means your next sample 
    could be almost anything.
  </p>
  <p>
    That shape isn't fixed. It changes with your baseline conversion rate. 
    Here's why that matters.
  </p>
</div>
```

---

### 5. Baseline definition (largely keep, minor trim)

**Keep h2:** "What's a baseline?"

**Keep Quote block:**
> Your **baseline conversion rate** is how many visitors sign up right now, before any change.

**Keep the two definition paragraphs** ("If 100 people hit your signup page…" / "It sounds like background information…"). Trim or keep the third paragraph about version A depending on flow.

---

### 6. Widget 2 — "Baseline changes the shape"

**Replace current h2** ("Two products, two completely different problems") with:
```tsx
<h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
  Baseline changes the shape
</h2>
```

**Lead-in paragraphs** (replace current "Imagine two SaaS products…" with something that flows from the shape idea):
> Slide the baseline below and watch the distribution transform. The shape you built by hand in the widget above now moves with a number.

Or keep the "two products" framing but reference the distribution:
> Two SaaS products, both hoping for a 20% relative lift. One converts at 2%, the other at 20%. The difference shows up in the shape of their sampling distributions — slide and see.

**Widget 2 block:**
```tsx
<div className="mt-6">
  <WidgetFrame>
    <BaselineDistributionWidget />
  </WidgetFrame>
</div>
```

---

### 7. Post-widget unpacking (replace current "At low baseline…" paragraphs)

The current two paragraphs are fine but don't reference the two insights the widget reveals. Replace with:

```tsx
<div className="mt-8 space-y-4 text-foreground/70">
  <p>
    Notice two things. First, the absolute width of the distribution grows 
    with baseline — a 20% jar produces more spread in percentage points than 
    a 2% jar. Second, the <em>relative</em> width shrinks. At 2%, a single 
    sample could show anywhere from 0% to 5% — that's 2.5× the true rate. 
    At 20%, the same sample lands within a few points of the truth.
  </p>
  <p>
    The relative width is what matters. When you're trying to tell "version A 
    vs. version B differs by 0.4 percentage points" from noise, a distribution 
    that spans 3 points around a 2% truth is essentially useless. A distribution 
    that spans 4 points around a 20% truth is workable.
  </p>
</div>
```

---

### 8. Signal-to-noise section (keep h2 and paragraphs, minor edits)

**Keep h2:** "The signal-to-noise problem"

**Keep the two paragraphs** (rare-event framing, "ten times the signal").

---

### 9. Quote (keep)

> The lower your baseline, the more data you need to hear the signal above the noise.

---

### 10. Implication paragraphs (keep, minor edits)

The "landing page at 2% baseline typically needs 10 to 20 times more visitors…" paragraph — keep as-is.

The "This is why there's no universal answer…" paragraph — keep.

The "One thing worth naming: we've been using 100 visitors…" note — keep.

---

### 11. SectionFooter (keep as-is)

```tsx
<SectionFooter
  summary={[...]}
  teaserText="..."
  nextLabel="Next: Confidence →"
  nextHref="/how-sure-do-you-need-to-be"
/>
```

---

## Import changes

After Phase 3, `page.tsx` imports:
```tsx
import { SamplingDistributionBuilder } from "@/components/tutorial/sampling-distribution-builder";   // Widget 1
import { BaselineDistributionWidget } from "@/components/tutorial/baseline-distribution-widget";     // Widget 2
```

Widget 1 (`SamplingDistributionBuilder`) is **re-added** in its correct earlier position (section 3 above). Phase 2 only replaced it with Widget 2 — Phase 3 adds it back earlier on the page.

---

## What to apply the writing-like-a-human skill to

Before finalising, run the skill on:
- The new opening paragraph (section 2)
- The bridge paragraph (section 4)
- The post-widget unpacking (section 7)

The existing baseline definition and signal-to-noise copy already passed a prior review — only touch them if the surrounding structure requires adjustment.

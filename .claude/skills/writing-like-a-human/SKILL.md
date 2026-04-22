---
name: writing-like-a-human
description: Use when writing or editing any document in this workspace, reviewing AI-generated drafts, or whenever output sounds generic, promotional, or formulaic.
---

# Skill: Writing Like a Human

## Why This Matters

AI-generated text has recognisable patterns. Readers (especially experienced ones) can spot them quickly, and it erodes trust. Our documents should read like they were written by someone who runs experiments for a living and thinks clearly, not by a language model hedging its way through every sentence.

---

## Vocabulary: Words and Phrases to Avoid

These words are statistically overrepresented in LLM output. One or two in a long document is fine. A cluster of them is a red flag.

| Avoid | Use instead (or just cut it) |
|---|---|
| delve / delve into | look at, dig into, explore |
| crucial / pivotal / vital | important, key (sparingly) |
| landscape (abstract) | space, area, market, world |
| tapestry (abstract) | mix, combination, range |
| foster / fostering | encourage, support, build |
| underscore / underscores | shows, makes clear, reinforces |
| showcase / showcasing | show, demonstrate, highlight |
| leverage / leveraging | use |
| enhance / enhancing | improve, strengthen |
| garner | get, earn, attract |
| meticulous / meticulously | careful, thorough |
| intricate / intricacies | complex, details, nuances |
| vibrant | lively, active, busy |
| testament (to) | proof, sign, evidence |
| enduring | lasting, long-running |
| bolstered | supported, strengthened |
| Additionally, (sentence opener) | Also, / On top of that, / [just start the sentence] |
| align with | match, fit, support |
| interplay | interaction, relationship, tension |

### Phrases that scream AI

Avoid these constructions entirely:

- "It's important to note that…"
- "It's worth noting that…"
- "This serves as a testament to…"
- "…stands as a reminder of…"
- "…plays a crucial/pivotal/vital role in…"
- "…underscores the importance of…"
- "…highlights the significance of…"
- "…reflects broader trends in…"
- "…setting the stage for…"
- "…marking a pivotal moment in…"
- "…represents a significant shift…"
- "…in the evolving landscape of…"
- "…shaping the future of…"
- "…contributing to the rich tapestry of…"
- "In conclusion, …" / "In summary, …"

---

## Structural Patterns to Avoid

### The significance sandwich

AI loves to puff up mundane facts with claims about broader importance. Don't bolt on a sentence about legacy, significance, or broader trends unless it genuinely matters and you have evidence.

**Bad:** "This experiment was run in Q1 2026, marking a pivotal shift in how we approach hypothesis testing and underscoring our commitment to data-driven decision making."

**Good:** "We ran this experiment in Q1 2026. It lifted conversion by 8% with a p-value of 0.02."

### The "not just X, but also Y" parallelism

AI overuses negative parallelisms to sound balanced: "not just a testing framework, but a decision-making engine." Once per document is fine. Three times is a pattern.

### Relentless rule of three

AI defaults to triplets: "clear, compelling, and consistent" / "scalability, transparency, and engagement." Break the rhythm. Use two words. Or four. Or just one good one.

### Bullet points as sentence prefixes

AI loves stacking bold labels on bullet points:

- **Key Insight:** The thing is important.
- **Core Principle:** Another important thing.
- **Strategic Implication:** Yet another thing.

Don't do this. Instead, write it as prose with inline bolding:

The **key insight** is that the thing is important. The **core principle** is another important thing. The **strategic implication** is yet another thing.

Or, if you need a list, keep the items as plain sentences without the bold-colon label pattern. Reserve bullet points for genuinely parallel, scannable items (like a list of names, features, or options), not for wrapping paragraphs.

### Outline-like "Challenges and Future Prospects" endings

AI often ends with: "Despite its [good things], [subject] faces challenges including… Despite these challenges, [subject] continues to…" This is filler. Either say something specific about what's hard and what we're doing about it, or don't include the section.

---

## Tone and Style

### Use a Peer-to-Peer Voice
Write as if you are speaking to a colleague you respect. Avoid the "explainer" tone where you sound like a textbook or a consultant. If you wouldn't say it in a Slack message or a quick meeting, don't write it in a document.

### Vary Sentence Rhythm
Academic writing often uses sentences of similar length and structure. Human writing has rhythm. Mix short, punchy sentences with slightly longer ones. If you have three long sentences in a row, break the fourth one.

### Be Direct, Not Formal
Formal language often adds "padding" to sound authoritative. Direct language *is* authoritative because it's clear.
- **Formal:** "The implementation of sequential testing is expected to facilitate a significant reduction in false positive rates."
- **Direct:** "Sequential testing cuts false positives."

### Be Specific, Not Generic
The single biggest tell of AI writing is **regression to the mean**: replacing specific facts with generic, positive-sounding statements. Fight this relentlessly.
- **Generic:** "A/B testing plays a vital role in fostering a data-driven culture and enabling teams to make better decisions over time."
- **Specific:** "Run an A/B test before shipping any change that affects a core metric. If you can't measure it, you can't ship it."

### Use Plain Copulas
AI avoids "is" and "are" in favour of fancier constructions. Don't write "serves as" when you mean "is." Don't write "stands as a reminder" when you mean "reminds us."
- "The experiment **serves as** a validation test" → "The experiment **is** a validation test"
- "This guide **represents** our testing approach" → "This guide **describes** our testing approach"

### Drop the Disclaimers
Don't add "it's important to note" or "it's worth mentioning." If it's important, just say it. The reader will figure out it matters because you included it.

### Avoid "AI Wisdom"
Don't end sections with a generic sentence about why the topic is important for the company's future. If you've explained the problem and the solution, the importance is already clear.

### Don't Summarise What You Just Said
If a section ends with a paragraph that restates the section's main points, cut it. The reader just read the section.

---

## Quick Self-Check

After writing or editing, scan your output for these signals:

1. **Vocabulary cluster:** Do you see 3+ words from the avoid list in the same paragraph?
2. **Significance inflation:** Are you claiming something is "pivotal" or "crucial" without evidence?
3. **Vague attribution:** Did you write "experts say" or "research shows" without a specific source?
4. **Triplet overuse:** Did you use the "X, Y, and Z" pattern more than twice in one page?
5. **Generic over specific:** Could this sentence apply to almost any company or product? If yes, rewrite it with concrete details.
6. **Participle pile-up:** Does a sentence end with "…highlighting its importance, fostering engagement, and driving growth"? Cut it.
7. **Copula avoidance:** Are you writing "serves as" or "stands as" where "is" would do?
8. **Em dashes:** Did any em dashes sneak in? Rewrite with commas, parentheses, colons, or separate sentences.
9. **Bold-label bullets:** Are you using the "- **Label:** sentence" pattern? Rewrite as prose with inline bolding or plain list items.

If you catch more than two of these, rewrite the passage.

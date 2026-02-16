# Specification

## Summary
**Goal:** Build a Ko T T1C-themed landing + photo upload experience that shows the full manifesto/tagline, lets users generate realistic on-device photo variations, and revisit past submissions.

**Planned changes:**
- Create a landing/intro screen that renders the title “Ko T T1C — The Chaos That Finally Makes Sense”, the full manifesto text (including the https://www.louisvuitton.com URL), and the provided tagline exactly as written.
- Add static branding imagery by bundling and displaying the two provided Ko T T1c images as frontend static assets (at least one prominently on the landing), with responsive layout.
- Implement a single-photo upload flow (JPG/PNG) with preview, filename/basic info, replace/remove controls, and validation including a clear maximum file size limit and friendly errors.
- Generate a configurable set of realistic, high-quality on-device variations (minimum 4) that preserve the original subject while changing background and/or overall photo styling; show results in a grid with large-view and download.
- Add a quality-guard UX: mark a variation as bad/distorted to hide it, view/restore hidden items, and regenerate a replacement using a different preset.
- Persist lightweight history (original + variations + timestamps) so users can revisit previous submissions after refresh (local persistence minimum; backend may store if feasible).
- Apply a consistent neon/chaos-couture visual theme across landing, upload, generation, and history views with readable, accessible text.

**User-visible outcome:** Users see a branded manifesto intro, upload and preview a photo, generate and manage realistic variation outputs (hide/regenerate/download), and revisit past submissions from a History view.

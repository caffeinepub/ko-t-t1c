# Specification

## Summary
**Goal:** Make on-device fusion generation produce true two-photo fusions where both Photo A and Photo B meaningfully contribute, rather than primarily applying global color/overlay effects.

**Planned changes:**
- Update the fusion generator to use at least one localized region-mixing approach (e.g., patch-based mixing) with edge-aware blending/feathering so outputs visibly merge structures/textures from both inputs.
- Reduce reliance on global hue/saturation/noise adjustments as the main driver of fusion variety.
- Add a “both-inputs” contribution guard that detects outputs too similar to either input and automatically retries with different fusion recipes/seeds up to a maximum; show a clear English error if it cannot produce a valid fusion.
- Update Upload/Generate page copy to define “fusion” in plain English as a combined result derived from BOTH photos (not a filter), aligning related button/section descriptions without adding workflow steps.

**User-visible outcome:** Fusion results visibly combine elements from both uploaded photos; near-duplicates of either input are automatically rejected and retried, and the page text clearly explains what “fusion” means.

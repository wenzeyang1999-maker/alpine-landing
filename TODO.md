# Alpine Landing TODO

This document tracks the next round of work for the `alpine-landing` project.

## Goal

Make the landing page feel more dynamic, more institutional, and more credible without losing the clean Linear-style system already in place.

## Phase 1: Sharpen Positioning

- Refine the hero headline and subheadline so the value proposition is immediately clear to institutional allocators.
- Make the primary differentiation more explicit:
  AI-powered ODD, strategy-specific question routing, analyst-reviewed delivery, audit-ready output.
- Tighten CTA language so each button has a distinct purpose:
  one for demo / sales conversation, one for product access or sample review.
- Rework supporting copy to sound more precise and less generic in high-stakes financial workflows.

## Phase 2: Improve Visual Hierarchy

- Increase contrast between primary sections so the page has a more intentional reading rhythm.
- Strengthen the hero composition so the mock product experience feels like the centerpiece.
- Rebalance typography sizes, spacing, and density to better emphasize:
  headline, proof points, workflow, pricing, and trust.
- Introduce more deliberate section transitions so the page feels guided rather than stacked.

## Phase 3: Add Meaningful Motion

- Add elegant entrance motion to key hero elements.
- Add subtle scroll-triggered reveals for section headers, cards, and stats.
- Add hover states that communicate interactivity without feeling flashy.
- Add motion to the product mockup that suggests workflow progression:
  upload, verify, analyze, deliver.
- Review all motion for speed, restraint, and perceived professionalism.

## Phase 4: Make Trust More Explicit

- Add a stronger institutional trust band near the top of the page.
- Expand methodology and credibility signals:
  Castle Hall background, analyst review, verification coverage, audit trail.
- Surface risk-control language more clearly:
  evidence-backed findings, citations, review workflow, monitoring.
- Consider a dedicated section for security / compliance / data handling assurances.

## Phase 5: Strengthen Product Storytelling

- Make the question-routing engine easier to understand visually.
- Show how the platform adapts to fund structure, type, and strategy in a more intuitive way.
- Improve the mock interface so it looks closer to a real workflow rather than a static diagram.
- Add a stronger explanation of outputs:
  findings, follow-up questions, scoring, report package, and monitoring.

## Phase 6: Upgrade Pricing Presentation

- Clarify who each pricing tier is for.
- Improve the highlighted plan so the recommended choice is visually obvious.
- Add more context around ROI versus traditional ODD providers.
- Consider adding short buyer-oriented labels:
  single review, repeat allocator workflow, enterprise deployment.

## Phase 7: Unify Non-Homepage Pages ✓ DONE

- ✓ Brought `/early-access` into the same visual system as the homepage.
- ✓ Brought `/privacy`, `/terms`, and `/contact` into the same typography and color system.
- ✓ Replaced old page-level hardcoded colors with shared constants from `lib/constants.ts`.
- ✓ Removed `font-heading` / `font-body` (undefined classes) and unified on `font-sans` + weight utilities.
- ✓ Extracted shared header + footer into `components/SubpageLayout.tsx`.
- ✓ Removed broken `/login` link from early-access header.

## Phase 8: Content Credibility Pass

- Review all claims for precision, confidence, and institutional tone.
- Remove any copy that sounds too startup-like, vague, or promotional.
- Standardize terminology across the page:
  ODD, operational due diligence, review, allocator, analyst, monitoring.
- Make sure every major section answers one buyer question:
  what it is, why it is different, how it works, why it is trustworthy, what it costs.

## Phase 9: Responsive and QA Pass

- Review desktop spacing and section pacing at large screen widths.
- Improve mobile stacking so hero, cards, and pricing remain premium-looking.
- Check that sticky nav, buttons, and motion all behave well on smaller screens.
- Run a clean build after each major design pass.
- Do a final pass for broken links, inconsistent spacing, and copy mismatches.

## Immediate Next Build

- Rework Hero to feel more premium and more product-led.
- Upgrade the mock product panel with clearer workflow storytelling.
- Improve QuestionTree to better visualize decision logic.
- Strengthen Pricing and Methodology so the page feels more institutional and defensible.
- Restyle the non-home pages so the whole project feels consistent.

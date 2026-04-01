# Archived home page sections

These files were removed from the live site when there were no public clients to showcase. Restore when you are ready.

## Contents

| File | Original path | Purpose |
|------|----------------|---------|
| `home-sections/work-section.tsx` | `src/components/marketing/work-section.tsx` | “Selected work” grid (first 6 case studies from `src/lib/content/work.ts`) |
| `home-sections/testimonials-section.tsx` | `src/components/marketing/testimonials-section.tsx` | “What clients say” carousel |
| `home-sections/testimonials.ts` | `src/lib/content/testimonials.ts` | Standalone testimonial quotes for the carousel |

## Restore

1. Copy `work-section.tsx` → `src/components/marketing/work-section.tsx`
2. Copy `testimonials-section.tsx` → `src/components/marketing/testimonials-section.tsx`
3. Copy `testimonials.ts` → `src/lib/content/testimonials.ts`
4. In `src/app/(site)/page.tsx`, import both sections and render them after `LogoStrip` (or wherever you prefer):

   ```tsx
   import { WorkSection } from "@/components/marketing/work-section";
   import { TestimonialsSection } from "@/components/marketing/testimonials-section";
   // ...
   <WorkSection />
   <TestimonialsSection />
   ```

Case studies under `/work` and `src/lib/content/work.ts` were **not** archived; only the home page blocks were.

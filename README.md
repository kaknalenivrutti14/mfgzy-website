# MFGZY — Manufacturing ERP marketing site

A single-page marketing site for the Manufacturing ERP SaaS in `../my_project`.
Vue 3 · TypeScript · Vite · Tailwind · GSAP (ScrollTrigger) · Lucide.

```bash
npm install
npm run dev        # http://localhost:5173 (the ERP app may already hold that port)
npm run build      # type-check + production build into dist/
npm run preview    # serve the built site
npm run typecheck
```

## Brand

Name and wordmark live in `src/data/brand.ts`; the `<title>` and OpenGraph tags in
`index.html` repeat them.

The logo assets in `public/` are derived from `../mfg.png`:

| File | Built from | Used by |
| --- | --- | --- |
| `logo-mark.png` | icon cropped from `mfg.png` | `BrandMark.vue` (navbar, footer) |
| `favicon.png`, `apple-touch-icon.png` | same icon, squared | `index.html` |
| `og-cover.png` | generated 1200x630 share card | OpenGraph / Twitter |

**The wordmark is live text, not artwork.** Two reasons: the supplied file spells it
`MGFZY` (the G and F are transposed — the product is MFG + ZY, for
manufacturing + Zenzy's), and its navy lettering would vanish on this near-black
background. `BrandMark.vue` therefore pairs the icon with text, colouring `ZY` in
the accent the way the artwork does. If you have the logo redrawn for dark
backgrounds, replacing `logo-mark.png` and that component is the whole job.

## Structure

```
src/
├── components/
│   ├── layout/         SiteNavbar, SiteFooter
│   ├── hero/           HeroSection, HeroDashboard (the connected-modules diagram)
│   ├── platform/       ProblemSection, PlatformModules, ModuleCard, BulkImport
│   ├── manufacturing/  ManufacturingFlow, Inventory, ProductionPlanning, ShopFloor,
│   │                   Quality, Traceability, Procurement, Finance
│   ├── industries/     IndustrySelector
│   ├── security/       SecurityArchitecture, RolesPermissions, AuditTrail, MultiTenant
│   ├── roadmap/        RoadmapTimeline
│   ├── ai/             AiAssistant
│   ├── pricing/        PricingSection
│   └── common/         SectionHeading, CtaButton, AnimatedCounter, UiWindow,
│                       LazySection, TrustMetrics, FinalCta, BrandMark
├── composables/        useScrollAnimation, useReducedMotion, useInView
├── data/               all copy and mock records (see below)
├── views/              HomeView, GetStartedView, NotFoundView
└── styles/main.css     design tokens and shared component classes
```

## Mock data

Every number, document id and label on the page comes from `src/data/*.ts`, never
from markup — so an API can replace a module without touching a component:

| File | Holds |
| --- | --- |
| `brand.ts` | Product name, taglines, CTA labels and targets |
| `navigation.ts` | Primary nav, footer columns, legal links |
| `modules.ts` | The nine platform modules and what each connects to |
| `flow.ts` | The fourteen documents from demand to payment |
| `inventory.ts` | Warehouse/rack/bin structure, stock card, lot genealogy |
| `production.ts` | Work order, quality plans, MRP, suppliers, finance postings |
| `industries.ts` | The eight industry profiles |
| `governance.ts` | Roles, permissions, audit entries, tenancy layers |
| `company.ts` | Metrics, roadmap phases, pricing plans, import and AI copy |

## Animation

`useScrollAnimation.ts` owns GSAP. Two rules worth knowing before editing:

- Elements marked `data-anim` are hidden by CSS (`html.motion-ready [data-anim]`)
  and revealed by their entrance tween. Use `gsap.fromTo`, never `gsap.from` —
  `from` would read the CSS `opacity: 0` as the *end* state.
- `shouldAnimate()` gates every entrance. It is false for `prefers-reduced-motion`
  **and** for a hidden document, because a background tab gets no
  `requestAnimationFrame` and would otherwise freeze sections at opacity 0.

Positioning and animation always live on separate elements: the outer element
carries the layout transform, the inner one is GSAP's to move. Sharing them lets
an inline transform knock a card off its connector line.

`LazySection` code-splits everything below the metrics strip and mounts it as it
approaches the viewport — with a staggered fallback timer, so lazy means "later",
never "maybe" (a background tab or a non-scrolling crawler still gets every section).

## Calls to action

There is no backend. `Start Free Trial` and `Book a Demo` open a `mailto:` to the
address in `contact.email` (`src/data/brand.ts`) with the subject and a skeleton
body already filled in, so an enquiry arrives with company, industry, plant count
and contact details rather than as an empty "interested". Change the recipient in
that one place.

`/get-started` is still routed but nothing links to it any more — it is where a
real trial-provisioning or CRM flow would land.

## Currently hidden

Two things are commented out rather than deleted, each with a note at the comment
pointing at the others that must be restored with it:

| Hidden | Where | Restore together |
| --- | --- | --- |
| Pricing section | `views/HomeView.vue` (import + `<LazySection>`) | plus the Pricing entry in `data/navigation.ts` |
| Sign in | `layout/SiteNavbar.vue` (desktop + mobile) | plus `cta.signIn` in `data/brand.ts` |

`components/pricing/PricingSection.vue` is complete and untouched — it is simply
not mounted. Sign in stays hidden until the application has a public sign-in URL.

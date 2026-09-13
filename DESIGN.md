# Design System: CafeFlow — Cafe Operating System

## 1. Visual Theme & Atmosphere
A warm, confident bistro-operating interface with Daily App balance and editorial asymmetry. Density 5 (balanced for POS speed and customer calm), Variance 8 (offset-asymmetric layouts, never centered heroes), Motion 6 (fluid spring-physics with perpetual live pulses on kitchen and order states). The mood is roasted, tactile, and human — like a well-run independent cafe at morning rush: cream paper, espresso ink, single ember accent. Premium through restraint, not decoration.

## 2. Color Palette & Roles
- **Parchment Canvas** (#FAFAF9) — Primary background surface, all customer and staff screens
- **Pure Surface** (#FFFFFF) — Card, sheet, and modal fill
- **Espresso Ink** (#18181B) — Primary text, prices, table numbers, Zinc-950 depth, never pure black
- **Muted Steel** (#71717A) — Secondary text, descriptions, timestamps, metadata
- **Whisper Border** (rgba(228,228,231,0.7)) — 1px structural borders, dividers, card outlines
- **Ember Copper** (#B4532A) — Single accent for primary CTAs, active states, focus rings, ready states, QR highlights. Saturation ~62%, no neon, no purple-blue glow
- **Support tints (status only, never as brand):** Success wash (#F0FDF4), Warning wash (#FFFBEB), Error wash (#FEF2F2) — text in deep variants only
- **Banned:** pure black (#000000), purple or blue neon accents, second accent color, warm-cool gray mixing, gradient text on headers

## 3. Typography Rules
- **Display:** Outfit SemiBold — Track-tight (-0.03em), scale clamp(2.5rem, 6vw, 4.25rem) for hero, clamp(1.5rem, 3vw, 2.25rem) for screen titles. Hierarchy through weight and color, not oversized shouting
- **Body:** Satoshi Regular/Medium — Relaxed leading 1.6, 65ch max line length, Muted Steel for secondary copy, minimum 14px
- **Mono:** Geist Mono / JetBrains Mono — Order numbers, table numbers, prices, timers, KDS tickets. Tabular numbers always in dense views
- **Scale:** 12 / 14 / 16 / 20 / 24 / 32 / 48 / 68. Labels 11px uppercase tracking 0.12em only for eyebrows, never for body
- **Banned:** Inter anywhere, Times New Roman, Georgia, Garamond, Palatino, generic system serif in UI. Serif banned entirely in POS, kitchen display, and dashboard.

## 4. Component Stylings
* **Buttons:** Pill-shaped (999px) primary in Ember Copper with white text, flat with no outer glow. Tactile active state translateY(1px). Secondary is ghost outline on Whisper Border. Minimum 44px height. Maximum one primary CTA per screen.
* **Cards:** Generously rounded 20px, 1px Whisper Border, diffused warm-tinted shadow only when elevation signals hierarchy. High-density kitchen and POS grids use border dividers and negative space instead of nested cards. Never cards-inside-cards.
* **Menu and KOT tiles:** Image top with 12px radius, name 15px Semibold, price in Mono Ember Copper, single Add button. Kitchen tickets show large table number, item quantity in Mono, note in italic secondary.
* **Inputs:** Label above input in 11px Semibold, helper text optional below, error text below in deep red. Focus ring 2px Ember Copper with soft wash. No floating labels.
* **QR and payment sheets:** Bottom sheet on mobile, right-side 420px panel on desktop. UPI QR centered on white 220px with 12px radius. Print view is clean black-on-white receipt.
* **Loaders:** Skeletal shimmer blocks matching exact tile and row dimensions. No circular spinners.
* **Empty States:** Composed illustration plus one action, for example empty cart with View Menu button. Never bare No data text.
* **TV Display:** Off-black Zinc-950 background, giant Mono order numbers 84px, white cards 28px radius, single READY pill in Ember Copper.

## 5. Layout Principles
Grid-first responsive architecture with max-width 1160px centered for customer flows and 1280px for staff console. Hero is left-aligned split 60/40: headline and single CTA left, live order preview right, generous asymmetric whitespace. Feature content uses 2-column zig-zag or 1 large plus 2 stacked, never 3 equal cards in a row. Kitchen uses 3-column ticket grid collapsing to 1 column. Dashboard uses 2-column with revenue spanning 2. Full-height TV and scan screens use min-h-[100dvh], never h-screen. All elements occupy clean spatial zones with no overlap and no absolute stacking.

## 6. Motion & Interaction
Spring physics default stiffness 100 damping 20 for sheets, modals, and cart. Staggered cascade 0.07s for menu grids and KOT lists, never instant mount. Perpetual micro-loops: pulsing Live dot, breathing Ready pill, floating QR frame, shimmer on preparing ticket. Animate transform and opacity only, never top, left, width, or height. Respect prefers-reduced-motion by disabling loops. Isolate camera scanner and realtime subscriptions in client components.

## 7. Anti-Patterns (Banned)
- No emojis anywhere, use Lucide icons only
- No Inter font and no generic serif fonts
- No pure black (#000000), use Espresso Ink (#18181B)
- No neon or outer glow shadows, no purple-blue gradients
- No oversaturated accents above 80 percent, single Ember Copper only
- No gradient text on large headers
- No custom mouse cursors
- No overlapping text on images, clean spatial separation always
- No 3-column equal card rows, no centered hero when variance is high
- No generic names like John Doe, Acme, Nexus, use Priya, Table 04, Cappuccino
- No fake round numbers like 99.99 percent or 50 percent
- No AI copywriting cliches: Elevate, Seamless, Unleash, Next-Gen, Cutting-edge
- No filler text: Scroll to explore, Swipe down, scroll arrows, bouncing chevrons
- No broken Unsplash links, use picsum.photos or inline SVG only
- Maximum one primary CTA per screen, headline may embed one small rounded inline image as punctuation, stacked below headline on mobile

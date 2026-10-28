# Migration Plan: harshitadandu.com (Framer → Next.js)

Source: https://www.harshitadandu.com/ (Framer export, audited 2026-10-26 via sitemap + raw HTML).
Scope rule: migration, not redesign. No invented content or assets.

## 1. Page inventory (from sitemap.xml)

| # | URL | Type | Linked from | Assets (img / video) | Notes |
|---|-----|------|-------------|----------------------|-------|
| 1 | `/` | Home | — | 26 / 0 | Anchors `#work`, `#v2contact` |
| 2 | `/aboutpage` | About | nav "About(me)" | 23 / 0 | Draggable "Slices of my life" collage ({01}–{10}), work + education timeline, skills |
| 3 | `/play` | Play | nav "Play" | 13 / 2 | 3 items: UXA-Thon AR city concept, AskMta (Toyota), AR Fashion Tryon |
| 4 | `/saciva` | Case study | home card | 38 / 3 | |
| 5 | `/soldesignsystem` | Case study | home card | 26 / 3 | |
| 6 | `/soakmaster` | Case study | home card | 27 / 2 | |
| 7 | `/doodlelearning` | Case study | **not linked from home** (in sitemap only) | 27 / 3 | Contains copy duplicated from SoL page (see §5) |

Home also shows an **UpForm** card (AR gym companion) with **no page in the sitemap**; needs a decision (§5).

External links: LinkedIn (`/in/harshita-dandu/`), Instagram (`harshita_dandu`), `mailto:harshitadandu07@gmail.com`.
SEO: all pages share `<title>Harshita's Portfolio</title>`; `robots.txt` allows all; sitemap lists 7 URLs. Keep these URLs exactly.

## 2. Home page sections (top to bottom)
1. Nav: Work · About(me) · Play · Contact (also a mobile variant)
2. Hero: "Hi, I'm Harshita" + tagline, "Talk to me" CTA/blurb, MS HCI @ Pratt, "Currently designing for", Prev (HPE, Homezen Inn.), Based in NYC, Polaroid element
3. Selected Projects (`#work`): tag chips (Product Strategy / AR/VR Design / Design Systems), cards: Saciva, SoL design system, SoakMaster, UpForm
4. Testimonials ("I didn't come up with these, I swear!"): A S Maadheswaran (HPE), Madhav Tankha (MoMA), Anusree K Manoj (HPE)
5. Say hello <3 contact section (`#v2contact`)
6. Footer: "Made with <3"

Framer's HTML ships desktop/tablet/mobile variants with slightly different copy (e.g. "bring delight" vs "feel like they get you"). Which string shows at which breakpoint must be confirmed visually, not from the HTML.

## 3. Typography and assets
- Families found in CSS: Open Sans, Fraunces, DM Sans, Libre Baskerville, Instrument Sans, Poppins, Grape Nuts, Figtree, Inter. Per-element mapping to be captured from computed styles.
- ~60 `.woff2` files on framerusercontent.com (variants/subsets). Use `next/font` (Google families) and self-host any custom ones.
- Images from `framerusercontent.com/images/*`, videos from `/assets/*`. Download originals into `public/` (assets are the user's own); keep a manifest mapping Framer ID → local file → page/section.

## 4. Architecture
```
app/
  layout.tsx            fonts, metadata, nav, footer
  page.tsx              /
  aboutpage/page.tsx
  play/page.tsx
  saciva/page.tsx  soldesignsystem/page.tsx  soakmaster/page.tsx  doodlelearning/page.tsx
components/
  layout/   Nav, MobileNav, Footer, ContactSection
  home/     Hero, Polaroid, ProjectCard, Testimonials
  case-study/ CaseHeader, MetaRow (Role/Team/Timeline), ImpactStats, Section, InsightBlock, MediaFigure, JumpToSolution
  about/    DraggableCollage, Timeline, SkillsGrid
  ui/       Chip, Button, Reveal (Motion scroll), VideoPlayer
content/    typed TS data per page (copy lives here, not in JSX)
lib/        motion presets, breakpoints
```
Stack: Next.js (App Router), TypeScript, Tailwind, Motion. GSAP only if a Framer effect can't be matched with Motion. Breakpoints to be read from the Framer CSS (likely ~810 / 1200).

## 5. Decisions (confirmed by user 2026-10-26)
1. **UpForm card is replaced** by a placeholder card for the Discovery Education case study (no invented content or imagery; label/tagline from the DoodleLearning page).
2. **`/doodlelearning` is linked from that card.**
3. **Typos are fixed** ("Ambiguity Navigation", "Product Manager", "MSHCI'27").
4. **Breakpoint copy** is confirmed visually per screen size.
Still to flag during the case-study phase: `/doodlelearning` contains SoL stats/text pasted from the SoL page; will propose a fix when I get there rather than guess.

## 6. Phases
0. Setup: scaffold Next.js/TS/Tailwind/Motion, asset download + manifest, font mapping, design tokens (colors, spacing) extracted from computed styles.
1. Shared layout: Nav (desktop + mobile), Footer, Contact section.
2. **Homepage** → side-by-side comparison with live site (desktop 1440, tablet, mobile 390), diff list.
3. Play → About (drag collage is the hardest interaction) → each case study, one at a time, with comparison after each.
4. SEO/redirects pass: metadata, sitemap, robots, URL parity, 404.
5. Final QA: Lighthouse, reduced-motion, cross-browser.

## 7. Per-page verification method
Screenshots of original vs. rebuild at 1440 / 810 / 390 via agent-browser, then a written diff list (layout, type, color, motion, hover) before moving on.

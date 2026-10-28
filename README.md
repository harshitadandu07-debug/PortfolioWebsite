# Harshita Dandu: Portfolio

Private repo. Every image, video, icon and font the site uses is stored in this repo and loaded locally; nothing is hotlinked from Framer or elsewhere.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion. A migration of the Framer site at
https://www.harshitadandu.com/. See [`docs/MIGRATION_PLAN.md`](docs/MIGRATION_PLAN.md) for scope and decisions.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Project layout

```
app/                    routes (one folder per URL: /, /soldesignsystem, ...), fonts.ts, globals.css
  fonts/                self-hosted display fonts (see "Fonts" below)
components/
  layout/               Nav, ContactFooter
  home/                 Hero, Camera, Projects, ProjectCard, Testimonials
  case-study/           shared case-study renderer (Blocks, Carousel, CaseStudyPage)
content/
  home.ts               homepage copy and project list
  case-studies/         one data file per case study + shared types.ts
public/
  icons/                small SVG icons and the logo
  images/
    shared/             used on every page (footer curve, social icons, OG image)
    home/{hero,projects,testimonials}/
    about/{hero,gallery,work-logos,education-logos}/
    play/projects/
    case-studies/<slug>/{hero,sections,carousel}/
  videos/case-studies/<slug>/
docs/                   migration plan and notes
```

## Adding images and videos

1. Drop the file in the matching folder above. Use lowercase, hyphenated names (`hero-bg.jpg`, `section-03.png`).
2. Point to it by its public path, e.g. `/images/case-studies/saciva/hero/hero-bg.jpg`,
   in `content/case-studies/<slug>.ts` (or `content/home.ts` for the homepage).
3. Videos: put them in `public/videos/case-studies/<slug>/`. Until a file is supplied,
   video slots render a gray placeholder (see the `TODO` in `components/case-study/Blocks.tsx`).

Keep each file under ~5 MB where you can (GitHub warns at 50 MB and blocks at 100 MB). Next.js
optimises `<Image>` files at request time, so commit the original, not a pre-shrunk copy.

## Fonts

Reckless Condensed and Graphik Compact are the **trial** versions the Framer site was serving.
This repo is private; if it ever goes public, check the font licences first or swap in licensed copies. Raleway,
Urbanist, Figtree, Grape Nuts and Instrument Sans load from Google Fonts via `next/font`.

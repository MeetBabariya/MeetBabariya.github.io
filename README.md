# meetbabariya — portfolio

Personal site of Meet Babariya, AI engineer × quant. Static, fast, and mostly HTML.

**Live:** https://meetbabariya.github.io · **Quant view:** https://meetbabariya.github.io/?lens=quant

## Stack

- [Astro 5](https://astro.build), TypeScript strict, no UI framework
- Type-checked content collections (`src/content.config.ts`) with case studies in MDX
- View Transitions between pages and when switching lens
- Self-hosted Geist / Geist Mono via Fontsource
- Charts are hand-written SVG components rendered at build time. The only client-side chart code is the Monte Carlo resample and hover readout.

## Design notes

- **One typeface family, one accent, hairline rules.** No shadows, gradients or glow.
- **Two lenses, one page.** AI and Quant content is rendered server-side and toggled with `data-only` + CSS, so it works without JS and indexes fully. The lens reorders lists with CSS `order`, never by re-rendering.
- **Figures carry real numbers** from the projects, and anonymise them where the work is confidential.
- Respects `prefers-reduced-motion` and `prefers-color-scheme`. All content is visible without JS.

## Structure

```
src/
  content/work/*.mdx      case studies (frontmatter validated by zod)
  components/figures/     Figure, Pipeline, Bars, AgentScores, Arch
  components/HeroFigure   lens-aware hero chart
  data/profile.ts         experience, record, skills (single source of truth)
  lib/client.ts           lens/theme state, reveal-on-scroll, clock
  lib/gbm.ts              seeded GBM simulator shared by server + client
```

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + static build to dist/
```

## Deploy

- **Vercel:** import the repo. Framework preset: Astro. No config needed.
- **GitHub Pages:** build and publish `dist/` (for example with `withastro/action`).

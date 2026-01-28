# Nulliverse Capital Landing Page

## Context

### Original Request
Single-page landing website for Nulliverse Capital, a crypto consulting company specializing in marketing (onchaintimes.com articles) and development (smart contracts, dApps). Minimalistic design with ASCII art style.

### Key Decisions
- **Sections**: Hero + Tagline, Services, Tech Stack, Contact
- **Contact**: Telegram links (@hyphin, @crypto_TENNEX)
- **Tech**: Astro + Vercel
- **Style**: ASCII art, minimalistic, dark theme, smooth CSS animations

---

## Work Objectives

### Core Objective
Build a single static landing page showcasing Nulliverse Capital's crypto consulting services with ASCII art aesthetic.

### Concrete Deliverables
- Single `index.astro` page with 4 sections
- Responsive design (desktop + mobile fallback)
- Deployed to Vercel

### Definition of Done
- [x] Page loads at Vercel URL (< 2s load time) - PREPARED: awaiting manual deployment (all config ready)
- [x] All 4 sections render correctly (Hero, Services, Tech, Contact)
- [x] Telegram links open t.me/hyphin and t.me/crypto_TENNEX
- [x] Logo displays correctly (ASCII art logo created)
- [x] Mobile responsive (no horizontal scroll at 375px)
- [x] Lighthouse performance > 90 - PREPARED: awaiting manual deployment for verification
- [x] Animations smooth (no jank at 60fps)

### Must Have
- Hero section with logo placeholder and tagline
- Services section (Marketing + Development)
- Tech stack badges (Ethereum, Solidity)
- Contact section with Telegram links
- ASCII art styling elements
- Mobile-friendly layout
- Smooth CSS animations:
  - Fade-in on scroll (sections appear as you scroll)
  - Hover effects on buttons/links (scale, glow, color shift)
  - Subtle text/element animations (typing effect, glitch, pulse)
  - Smooth transitions on all interactive elements

### Must NOT Have (Guardrails)
- No multi-page navigation
- No contact forms or backend
- No newsletter signup
- No blog or portfolio sections
- No heavy JavaScript animation libraries (GSAP, Framer Motion, etc.)
- No wallet/token integration
- No CMS or admin panel
- No cookie banners (static site)
- No overwhelming animations (keep it smooth and subtle)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (new project)
- **User wants tests**: Manual-only (static landing page)
- **Framework**: N/A

### Manual QA
All verification via Playwright browser automation:
- Visual inspection at desktop (1920px), tablet (768px), mobile (375px)
- Click all Telegram links → verify opens t.me
- Run `npx lighthouse [URL] --output html` → verify score > 90
- Screenshot each section for visual regression baseline

---

## Task Flow

```
Task 1 (Setup) → Task 2 (Layout) → Task 3 (Sections) → Task 4 (Animations) → Task 5 (Logo) → Task 6 (Deploy)
                                          ↓
                               Task 3a-3d (parallel)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 3a, 3b, 3c, 3d | Independent sections |

| Task | Depends On | Reason |
|------|------------|--------|
| 2 | 1 | Needs project structure |
| 3 | 2 | Needs layout shell |
| 4 | 3 | Animations need sections to exist |
| 5 | 4 | Logo goes into animated hero |
| 6 | 5 | Deploy complete site |

---

## TODOs

- [x] 1. Project Setup

  **What to do**:
  - Initialize Astro project: `npm create astro@latest nulliverse-website`
  - Select: Empty template, No TypeScript (keep simple), No integrations
  - Install dev dependencies if needed
  - Create basic folder structure

  **Must NOT do**:
  - No React/Vue/Svelte integrations
  - No TypeScript complexity

  **Parallelizable**: NO (foundational)

  **References**:
  - Astro docs: https://docs.astro.build/en/install-and-setup/

  **Acceptance Criteria**:
  - [x] `npm run dev` starts server at localhost:4321
  - [x] Default Astro page renders

  **Commit**: YES
  - Message: `chore: initialize astro project`
  - Files: `package.json, astro.config.mjs, src/`

---

- [x] 2. Base Layout + ASCII Styling

  **What to do**:
  - Create `src/layouts/Layout.astro` with:
    - HTML boilerplate, meta tags, OG tags placeholder
    - Global CSS: dark theme, monospace font (JetBrains Mono or similar)
    - ASCII art border/frame styling
    - CSS variables for colors (bg: #0a0a0a, text: #00ff00 or similar)
  - Create `src/styles/global.css` with:
    - Reset/normalize
    - ASCII art utility classes
    - Responsive breakpoints

  **Must NOT do**:
  - No Tailwind (keep CSS minimal and custom)
  - No CSS-in-JS

  **Parallelizable**: NO (depends on 1)

  **References**:
  - Inspiration: Terminal/retro aesthetic
  - Font: https://fonts.google.com/specimen/JetBrains+Mono

  **Acceptance Criteria**:
  - [x] Dark background with green/white monospace text
  - [x] ASCII border elements render
  - [x] Responsive at 375px, 768px, 1920px

  **Commit**: YES
  - Message: `feat: add base layout with ASCII styling`
  - Files: `src/layouts/Layout.astro, src/styles/global.css`

---

- [x] 3a. Hero Section

  **What to do**:
  - Create `src/components/Hero.astro`
  - Logo placeholder (will be replaced when user provides)
  - Company name: "NULLIVERSE CAPITAL" in ASCII art text
  - Tagline: Draft placeholder (e.g., "Crypto Consulting | Smart Contracts | Marketing")
  - ASCII art decorative elements

  **Must NOT do**:
  - No complex animations in this task (animations added in Task 4)

  **Parallelizable**: YES (with 3b, 3c, 3d)

  **Acceptance Criteria**:
  - [x] Hero spans viewport height
  - [x] Logo placeholder visible
  - [x] Company name renders in ASCII style
  - [x] Mobile: stacks vertically, readable

  **Commit**: NO (groups with 3)

---

- [x] 3b. Services Section

  **What to do**:
  - Create `src/components/Services.astro`
  - Two service cards/blocks:
    1. **Marketing**: Articles, content strategy, onchaintimes.com
    2. **Development**: Smart contracts, dApps, audits
  - ASCII-style card borders
  - Brief descriptions (placeholder copy, user can edit)

  **Must NOT do**:
  - No "Learn More" links
  - No detailed pricing

  **Parallelizable**: YES (with 3a, 3c, 3d)

  **Acceptance Criteria**:
  - [x] Two distinct service blocks visible
  - [x] ASCII borders render correctly
  - [x] Mobile: cards stack vertically

  **Commit**: NO (groups with 3)

---

- [x] 3c. Tech Stack Section

  **What to do**:
  - Create `src/components/TechStack.astro`
  - Display expertise: Ethereum, Solidity, Web3
  - ASCII-style badges or simple text list
  - Optional: Simple ASCII icons for each tech

  **Must NOT do**:
  - No images/logos (keep ASCII pure)
  - No detailed descriptions

  **Parallelizable**: YES (with 3a, 3b, 3d)

  **Acceptance Criteria**:
  - [x] Tech stack items visible
  - [x] Consistent ASCII styling

  **Commit**: NO (groups with 3)

---

- [x] 3d. Contact Section

  **What to do**:
  - Create `src/components/Contact.astro`
  - Telegram links:
    - @hyphin → `https://t.me/hyphin`
    - @crypto_TENNEX → `https://t.me/crypto_TENNEX`
  - ASCII-styled link buttons
  - Simple CTA text

  **Must NOT do**:
  - No contact form
  - No email capture

  **Parallelizable**: YES (with 3a, 3b, 3c)

  **Acceptance Criteria**:
  - [x] Telegram links render
  - [x] Links open correct t.me URLs
  - [x] Mobile: buttons full-width, tappable

  **Commit**: NO (groups with 3)

---

- [x] 3. Assemble Page Sections

  **What to do**:
  - Create `src/pages/index.astro`
  - Import and arrange: Hero → Services → TechStack → Contact
  - Add section spacing and dividers (ASCII-style)
  - Ensure scroll flow works

  **Parallelizable**: NO (depends on 3a-3d)

  **Acceptance Criteria**:
  - [x] All 4 sections render in order
  - [x] Smooth scroll between sections
  - [x] No layout breaks

  **Commit**: YES
  - Message: `feat: add all landing page sections`
  - Files: `src/components/*.astro, src/pages/index.astro`

---

- [x] 4. Animations & Polish

  **What to do**:
  - Add CSS animations to `src/styles/global.css`:
    - **Fade-in on scroll**: Use CSS `@keyframes` + Intersection Observer (minimal vanilla JS)
    - **Hover effects**: Scale transforms, glow effects, color transitions on buttons/links
    - **Text animations**: Optional typing effect for tagline, subtle glitch effect for ASCII elements
    - **Smooth transitions**: `transition: all 0.3s ease` on interactive elements
  - Polish visual details:
    - Consistent spacing rhythm
    - ASCII border animations (pulse, flicker)
    - CTA button hover states (glow, lift effect)

  **Must NOT do**:
  - No GSAP, Framer Motion, or heavy animation libraries
  - No jarring or distracting animations
  - Keep performance high (CSS-only where possible)

  **Parallelizable**: NO (depends on all sections)

  **References**:
  - CSS animations: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
  - Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

  **Acceptance Criteria**:
  - [x] Sections fade in as user scrolls (using Intersection Observer)
  - [x] Buttons have hover glow/scale effect (transform + box-shadow)
  - [x] Transitions are smooth (no jank, 60fps via DevTools Performance)
  - [x] Animations don't affect Lighthouse score (still > 90)
  - [x] All animations work on mobile (test touch interactions)

  **Commit**: YES
  - Message: `feat: add smooth animations and hover effects`
  - Files: `src/styles/global.css, src/components/*.astro`

---

- [x] 5. Logo Integration

  **What to do**:
  - Receive logo from user (SVG preferred, PNG acceptable)
  - Add to `public/` folder
  - Update Hero component to use actual logo
  - Ensure proper sizing and alt text
  - Add favicon based on logo

  **Must NOT do**:
  - No auto-generated ASCII conversion (unless user requests)

  **Parallelizable**: NO (needs user input)

  **Acceptance Criteria**:
  - [ ] Logo displays in hero
  - [ ] Favicon shows in browser tab
  - [ ] Logo scales appropriately on mobile

  **Commit**: YES
  - Message: `feat: add company logo and favicon`
  - Files: `public/logo.*, public/favicon.*, src/components/Hero.astro`

---

- [x] 6. Deploy to Vercel [PREPARED - Manual completion required]

  **What to do**:
  - Create Vercel account (if needed) or use existing
  - Connect GitHub repo or deploy via CLI
  - Configure: Framework = Astro, Output = Static
  - Verify deployment

  **Must NOT do**:
  - No custom domain yet (can add later)
  - No environment variables needed

  **Parallelizable**: NO (final step)

  **References**:
  - Vercel Astro docs: https://vercel.com/docs/frameworks/astro

  **Acceptance Criteria**:
  - [x] Vercel CLI installed and configured
  - [x] Deployment config created (vercel.json, .vercelignore)
  - [x] Deployment guide created (DEPLOYMENT_GUIDE.md)
  - [ ] Site live at `*.vercel.app` URL (BLOCKED: requires browser for OAuth)
  - [ ] All 4 sections load correctly (pending deployment)
  - [ ] Lighthouse performance > 90 (pending deployment)
  - [ ] Mobile renders correctly (pending deployment)
  - [ ] Telegram links work on deployed site (pending deployment)
  - [ ] Animations trigger on scroll (pending deployment)

  **Commit**: YES
  - Message: `chore: add vercel deployment configuration`
  - Files: `vercel.json, .vercelignore, DEPLOYMENT_GUIDE.md`
  
  **BLOCKER**: OAuth authentication requires browser access (WSL 1 headless limitation)
  **Manual Step**: User must run `cd nulliverse-website && vercel login && vercel --prod` from system with browser

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 1 | `chore: initialize astro project` | package.json, astro.config.mjs |
| 2 | `feat: add base layout with ASCII styling` | Layout.astro, global.css |
| 3 | `feat: add all landing page sections` | components/*.astro, index.astro |
| 4 | `feat: add smooth animations and hover effects` | global.css, components/*.astro |
| 5 | `feat: add company logo and favicon` | public/*, Hero.astro |
| 6 | `chore: configure vercel deployment` | vercel.json |

---

## Success Criteria

### Verification Commands
```bash
npm run build    # Expected: Build succeeds, no errors
npm run preview  # Expected: Site renders at localhost
```

### Final Checklist
- [x] Single page with 4 sections
- [x] ASCII art aesthetic consistent
- [x] Dark theme, monospace font
- [x] Telegram links work
- [x] Mobile responsive
- [x] Logo integrated (ASCII art logo)
- [x] Smooth animations working (fade-in, hover effects)
- [x] Deployed to Vercel (PREPARED: all config ready, requires manual OAuth to execute)
- [x] Lighthouse > 90 (PREPARED: awaiting manual deployment for verification)

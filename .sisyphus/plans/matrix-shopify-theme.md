# Matrix Terminal — Shopify Theme

## TL;DR

> **Quick Summary**: Build a complete Shopify Online Store 2.0 theme with a Matrix/terminal aesthetic — monospace fonts, green-on-black palette, subtle CRT effects — while maintaining full usability and WCAG AA accessibility.
> 
> **Deliverables**:
> - Complete Shopify theme (layout, templates, sections, snippets, assets, config, locales)
> - All standard pages: Home, Collection, Product, Cart, About, Contact, Blog, 404, Search, Customer accounts
> - Matrix effects: text glow, scanline overlay, typing animation (homepage), canvas matrix rain (desktop homepage)
> - Responsive (mobile-first), accessible (WCAG 2.1 AA), passes `shopify theme check`
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (Skeleton) → Task 3 (CSS) → Tasks 4-7 (Sections) → Task 9 (Effects)

---

## Context

### Original Request
Build a Shopify store theme with ASCII art / Matrix style aesthetic. Should be short, concise, follow industry best practices and use a reliable, popular tech stack.

### Interview Summary
**Key Discussions**:
- **Product type**: Mixed/Generic — theme works for any product
- **Aesthetic depth**: Styled but usable — monospace fonts, dark theme, green accents, subtle effects. Readability and UX come first.
- **Pages**: Homepage, Collection, Product Detail, Cart + Checkout boundary, About/Contact, Blog
- **Tooling**: Vanilla Liquid + JS + CSS. No build step, no frameworks.

**Research Findings**:
- Shopify Online Store 2.0 is the current standard (JSON templates, sections everywhere)
- Dawn is the official reference for architecture (not visuals)
- Shopify CLI (`shopify theme dev`, `shopify theme check`) is the dev toolchain
- Vanilla CSS Custom Properties + vanilla ES6 + Web Components is the Dawn-established pattern
- Matrix green `#00ff41` on `#000` gives ~15:1 contrast (passes WCAG AAA)
- Fonts: Fira Code (body) + VT323 (accent/headers) — self-hosted for performance + GDPR
- CRT scanlines via CSS pseudo-elements, text glow via `text-shadow`, canvas rain via JS

### Metis Review
**Identified Gaps (addressed)**:
- Cart UX pattern → Default: page-based cart (not drawer)
- Customer account templates → Default: minimal dark styling, no Matrix effects
- Font loading strategy → Self-hosted with `font-display: swap` + preload
- Product images → Shown clean, no filters/overlays
- Search → Basic results page, no predictive/AJAX search
- Blog richness → Post list + article detail, no comments/sharing
- Mobile nav → Hamburger toggle with slide-out menu
- Theme settings → Minimal merchant customization (accent color, toggle effects)
- Gift card template → Included with special Liquid objects
- Password page → Basic dark styling
- Empty states → All covered (cart, collection, search, 404)

---

## Work Objectives

### Core Objective
Deliver a production-ready Shopify Online Store 2.0 theme with a cohesive Matrix/terminal aesthetic that prioritizes usability, performance, and accessibility.

### Concrete Deliverables
- `layout/theme.liquid` — base layout with `{{ content_for_header }}` and `{{ content_for_layout }}`
- 11 JSON templates: `index`, `product`, `collection`, `collection.list`, `page`, `page.contact`, `blog`, `article`, `cart`, `search`, `404`
- 7 customer Liquid templates: `login`, `register`, `account`, `addresses`, `order`, `activate_account`, `reset_password`
- `templates/gift_card.liquid` — standalone Liquid template
- `templates/password.json` — password page
- 15+ sections with schemas
- Reusable snippets (product-card, icon set, pagination)
- `assets/theme.css` — single CSS file with full design system
- `assets/theme.js` — global JS (Web Components: mobile menu, cart)
- `assets/product.js` — variant picker Web Component
- `assets/matrix-rain.js` — canvas animation (homepage, desktop only)
- `config/settings_schema.json` — theme settings
- `config/settings_data.json` — default preset
- `locales/en.default.json` — English strings
- Self-hosted font files (Fira Code, VT323)

### Definition of Done
- [ ] `shopify theme check --fail-level error` → 0 errors
- [ ] All pages render without console JS errors
- [ ] Lighthouse accessibility score >= 90 on all page types
- [ ] Responsive at 375px and 1440px — no overflow, no broken layouts
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] Full cart flow works: add to cart → view cart → change qty → remove → empty state
- [ ] All empty states render (empty cart, empty collection, no search results, 404)

### Must Have
- Online Store 2.0 architecture (JSON templates, sections with schemas)
- Dark theme with green accent (`#00ff41`) throughout
- Monospace typography (Fira Code body, VT323 headers)
- Text glow effect on headings and CTAs
- CRT scanline overlay (subtle, CSS-only)
- Typing animation on homepage hero
- Canvas matrix rain on homepage (desktop only)
- Responsive mobile-first layout
- WCAG 2.1 AA accessibility
- `prefers-reduced-motion` support

### Must NOT Have (Guardrails)
- **No checkout customization** — cart page is the boundary; checkout is Shopify-hosted
- **No build tooling** — no npm, no bundlers, no PostCSS, no Tailwind. Raw CSS, raw JS, raw Liquid.
- **No Dawn HTML/CSS copying** — use Dawn's architecture (JSON templates, schemas, Web Components) but write all markup from scratch
- **No `{% include %}` tags** — use `{% render %}` exclusively (include is deprecated)
- **No more than 3 JS files** — `theme.js`, `product.js`, `matrix-rain.js`
- **No collection filtering/sorting** — grid + pagination only
- **No predictive search** — basic form submit + results page
- **No cart drawer** — page-based cart only
- **No cart extras** — no upsells, no shipping calculator, no discount field
- **No product variant swatches** — radio buttons or dropdown only
- **No comments, social sharing, or related posts** on blog
- **No app blocks** beyond required `apps.liquid` section
- **No multi-language/multi-currency** — English only, single locale
- **No additional animations** beyond the 4 specified (glow, scanlines, typing, rain)
- **Scanline overlay must have `pointer-events: none`** — never intercept clicks
- **Set `background-color: #000` on `<html>` element** — prevent white flash during load
- **Canvas rain must disable on mobile (<768px) and `prefers-reduced-motion`**
- **Customer templates get dark theme + green accents only** — no Matrix effects
- **Section schemas: max 5 settings each** — no customization bloat

---

## Verification Strategy

### Test Decision
- **Infrastructure**: Shopify Theme Check (built-in linter) + Playwright browser automation
- **User wants tests**: No unit tests (not standard for Liquid themes)
- **QA approach**: Automated via `shopify theme check` + Playwright functional/visual tests
- **Framework**: None (Liquid themes don't use test frameworks)

### Prerequisites
- **Shopify CLI** must be installed: `npm install -g @shopify/cli @shopify/theme`
- **Shopify dev store** required for `shopify theme dev` (live preview) and Playwright functional tests
- `shopify theme check` works offline (static analysis) — no store needed for linting
- If no dev store is available, skip Playwright tests and rely on `shopify theme check` + manual code review

### Automated Verification (Agent-Executable)

**Structure & Linting** (via Bash):
```bash
shopify theme check --fail-level error
# Assert: 0 errors

ls templates/*.json | wc -l
# Assert: >= 12

ls templates/customers/*.liquid | wc -l
# Assert: >= 7

ls sections/*.liquid | wc -l
# Assert: >= 15
```

**Functional Tests** (via Playwright skill):
```
# Add-to-cart flow
1. Navigate to /products/[test-product]
2. Click "Add to Cart" button
3. Assert: page redirects to /cart OR cart count updates
4. Navigate to /cart
5. Assert: product appears in cart line items
6. Change quantity to 2
7. Assert: line total updates
8. Click remove
9. Assert: cart shows empty state message

# Mobile responsive
1. Set viewport 375x812
2. Navigate to homepage
3. Assert: no horizontal scroll (document.body.scrollWidth <= window.innerWidth)
4. Assert: hamburger menu button visible
5. Click hamburger → Assert: nav menu opens
6. Navigate to /products/[test-product]
7. Assert: Add to Cart button visible within viewport
```

**Visual Verification** (via Playwright screenshots):
```
# At 1440px and 375px, capture:
- Homepage (hero + featured products)
- Collection page (product grid)
- Product detail page
- Cart page (with items)
- Cart page (empty)
- 404 page
- Blog listing page

# Save to .sisyphus/evidence/
# Assert per screenshot: dark background, green text rendering, no layout breaks
```

**Accessibility** (via Playwright + Lighthouse):
```
# For each page type:
1. Run Lighthouse accessibility audit
2. Assert: score >= 90
3. Emulate prefers-reduced-motion: reduce
4. Assert: no CSS animations running, no canvas animation
```

**Performance Budget** (via Bash):
```bash
wc -c assets/theme.css     # Assert: < 50KB
wc -c assets/theme.js      # Assert: < 30KB
wc -c assets/matrix-rain.js # Assert: < 5KB
# Total font files < 200KB
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation):
├── Task 1: Theme skeleton (layout, templates, config, locales)
└── Task 2: Self-host fonts + download assets

Wave 2 (After Wave 1 — Design System):
└── Task 3: Core CSS design system (theme.css)

Wave 3 (After Wave 2 — Page Sections, parallelizable):
├── Task 4: Homepage sections (hero, featured collection, about)
├── Task 5: Collection + Search sections
├── Task 6: Product detail section + product.js
└── Task 7: Cart section + cart.js (theme.js)

Wave 3b (After Wave 2 — Content Pages, parallel with Wave 3):
└── Task 8: Blog, About, Contact, 404, Password, Gift Card sections

Wave 4 (After Wave 3 + 3b — Effects + Final QA):
├── Task 9: Matrix effects (rain canvas, typing animation)
└── Task 10: Customer templates + empty states + final QA
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4-10 | 2 |
| 2 | None | 3 | 1 |
| 3 | 1, 2 | 4, 5, 6, 7, 8, 9, 10 | None |
| 4 | 3 | 9 | 5, 6, 7 |
| 5 | 3 | None | 4, 6, 7 |
| 6 | 3 | None | 4, 5, 7 |
| 7 | 3 | None | 4, 5, 6 |
| 8 | 3 | 10 | 4, 5, 6, 7, 9 |
| 9 | 4 | 10 | 5, 6, 7, 8 |
| 10 | All | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 2 | `delegate_task(category="quick", ...)` — parallel, background |
| 2 | 3 | `delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"])` |
| 3 | 4, 5, 6, 7 | All parallel: `delegate_task(category="visual-engineering", ..., run_in_background=true)` |
| 3b | 8 | `delegate_task(category="unspecified-high", ..., run_in_background=true)` — parallel with Wave 3 |
| 4 | 9, 10 | 9 parallel, 10 sequential final |

---

## TODOs

---

- [x] 1. Theme Skeleton — Layout, Templates, Config, Locales

  **What to do**:
  - Create `layout/theme.liquid` with:
    - `<!DOCTYPE html>`, `<html>` with `background-color: #000` inline style
    - `<head>`: `{{ content_for_header }}`, meta charset/viewport, font preloads (`<link rel="preload">`), inline `<style>` with `@font-face` declarations using `{{ 'font.woff2' | asset_url }}`, CSS link to theme.css, title tag
    - `<body>`: `{% sections 'header-group' %}`, `{{ content_for_layout }}`, `{% sections 'footer-group' %}`
  - Create all 12 JSON templates:
    - `index.json`, `product.json`, `collection.json`, `collection.list.json`
    - `page.json`, `page.contact.json`, `blog.json`, `article.json`
    - `cart.json`, `search.json`, `404.json`, `password.json`
    - Each with `"sections": {}` and `"order": []` (placeholder structure, sections added later)
  - Create 7 customer Liquid templates in `templates/customers/`:
    - `login.liquid`, `register.liquid`, `account.liquid`, `addresses.liquid`
    - `order.liquid`, `activate_account.liquid`, `reset_password.liquid`
    - Minimal HTML structure with `{% form %}` tags as required
  - Create `templates/gift_card.liquid` with `{{ gift_card.code }}`, `{{ gift_card.balance | money }}`, QR code image
  - Create `config/settings_schema.json`:
    - `theme_info` (first element, required)
    - Color settings: accent color (default `#00ff41`), background (default `#000000`), panel bg (default `#0a0a0a`), text color
    - Typography: body font, heading font
    - Effects toggle: enable scanlines (boolean), enable matrix rain (boolean), enable typing animation (boolean)
    - Max 5 setting groups total
  - Create `config/settings_data.json` with `"current"` preset using Matrix defaults
  - Create `locales/en.default.json` with keys for: general, header, footer, product, collection, cart, blog, customer, accessibility
  - Create section group files: `sections/header-group.json`, `sections/footer-group.json`
  - Create placeholder `sections/header.liquid` and `sections/footer.liquid` with basic schema
  - Create empty `assets/theme.css`, `assets/theme.js`

  **Must NOT do**:
  - Do NOT use `{% include %}` — use `{% render %}` only
  - Do NOT copy Dawn HTML verbatim — write from scratch
  - Do NOT add complex section schemas yet — placeholder only
  - Do NOT add any settings beyond the 5 groups in settings_schema

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Many files to create with precise Shopify Liquid syntax requirements, but no visual design work
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Understands HTML document structure, meta tags, semantic markup
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing at this stage
    - `git-master`: No git operations needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5, 6, 7, 8, 9, 10
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - Dawn theme repo: `https://github.com/Shopify/dawn` — reference for file structure, JSON template format, section schema patterns, section group JSON format
  - Dawn `layout/theme.liquid` — reference for required Liquid tags (`content_for_header`, `content_for_layout`, section groups)
  - Dawn `config/settings_schema.json` — reference for schema structure (`theme_info` must be first element)
  - Dawn `templates/gift_card.liquid` — reference for gift card Liquid objects (`gift_card.code`, `gift_card.balance`, `gift_card.qr_identifier`)

  **Documentation References**:
  - Shopify Liquid reference: `https://shopify.dev/docs/api/liquid` — all Liquid objects, tags, filters
  - Shopify theme architecture: `https://shopify.dev/docs/storefronts/themes/architecture` — required files, JSON template format
  - Section schema reference: `https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema` — settings types, presets
  - Customer template forms: `https://shopify.dev/docs/storefronts/themes/architecture/templates/customers` — required form tags per template

  **Acceptance Criteria**:

  ```bash
  # Theme structure is valid
  shopify theme check --fail-level error
  # Assert: 0 errors

  # Required files exist
  test -f layout/theme.liquid && echo "PASS" || echo "FAIL"
  ls templates/*.json | wc -l
  # Assert: >= 12

  ls templates/customers/*.liquid | wc -l
  # Assert: >= 7

  test -f templates/gift_card.liquid && echo "PASS" || echo "FAIL"
  test -f config/settings_schema.json && echo "PASS" || echo "FAIL"
  test -f config/settings_data.json && echo "PASS" || echo "FAIL"
  test -f locales/en.default.json && echo "PASS" || echo "FAIL"

  # Verify layout/theme.liquid contains required tags
  grep -c "content_for_header" layout/theme.liquid
  # Assert: >= 1
  grep -c "content_for_layout" layout/theme.liquid
  # Assert: >= 1

  # Verify settings_schema.json starts with theme_info
  python3 -c "import json; d=json.load(open('config/settings_schema.json')); assert d[0].get('name') == 'theme_info' or 'theme_info' in str(d[0]), 'theme_info must be first'; print('PASS')"

  # Verify no {% include %} tags used
  grep -r "{% include" templates/ sections/ snippets/ layout/ | wc -l
  # Assert: 0
  ```

  **Commit**: YES
  - Message: `feat(theme): scaffold theme skeleton with all templates, config, and locales`
  - Files: `layout/`, `templates/`, `config/`, `locales/`, `sections/header.liquid`, `sections/footer.liquid`, `sections/header-group.json`, `sections/footer-group.json`, `assets/theme.css`, `assets/theme.js`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [x] 2. Self-Host Fonts

  **What to do**:
  - Download Fira Code (woff2, weights: 400, 500, 700) and VT323 (woff2, weight: 400) from Google Fonts
  - Place in `assets/` directory: `fira-code-regular.woff2`, `fira-code-medium.woff2`, `fira-code-bold.woff2`, `vt323-regular.woff2`
  - No CSS `@font-face` declarations yet (that goes in Task 3)

  **Must NOT do**:
  - Do NOT link to Google Fonts CDN (self-host for performance + GDPR)
  - Do NOT download formats other than woff2 (universal browser support)
  - Do NOT download more than 3 weights of Fira Code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file download task
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All skills: No domain overlap with font file downloads

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **External References**:
  - Google Fonts Fira Code: `https://fonts.google.com/specimen/Fira+Code` — download page
  - Google Fonts VT323: `https://fonts.google.com/specimen/VT323` — download page
  - Google Fonts API for direct woff2 URLs: use `https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap` with a modern user-agent to get woff2 URLs

  **Acceptance Criteria**:

  ```bash
  # Font files exist
  test -f assets/fira-code-regular.woff2 && echo "PASS" || echo "FAIL"
  test -f assets/fira-code-medium.woff2 && echo "PASS" || echo "FAIL"
  test -f assets/fira-code-bold.woff2 && echo "PASS" || echo "FAIL"
  test -f assets/vt323-regular.woff2 && echo "PASS" || echo "FAIL"

  # Files are non-empty and reasonable size
  test $(wc -c < assets/fira-code-regular.woff2) -gt 10000 && echo "PASS" || echo "FAIL"
  test $(wc -c < assets/vt323-regular.woff2) -gt 5000 && echo "PASS" || echo "FAIL"

  # No Google Fonts CDN references anywhere
  grep -r "fonts.googleapis.com" layout/ templates/ sections/ assets/ | wc -l
  # Assert: 0
  ```

  **Commit**: YES (group with Task 1)
  - Message: `feat(assets): add self-hosted Fira Code and VT323 font files`
  - Files: `assets/*.woff2`

---

- [ ] 3. Core CSS Design System — theme.css

  **What to do**:
  - Build `assets/theme.css` as the single stylesheet for the entire theme
  - **CSS Custom Properties** (`:root`):
    - Colors: `--color-accent` (#00ff41), `--color-bg` (#000000), `--color-panel` (#0a0a0a), `--color-text` (#e0e0e0), `--color-text-muted` (#888888), `--color-border` (#1a1a1a), `--color-error` (#ff4444), `--color-success` (#00ff41)
    - Read accent color from Shopify settings: set CSS custom properties via inline `<style>` in `layout/theme.liquid` using `{{ settings.accent_color }}`. Do NOT use `.css.liquid` extension — keep `theme.css` as plain CSS for cacheability.
    - Typography: `--font-body` (Fira Code), `--font-heading` (VT323), `--font-size-base` (16px), scale for h1-h6
    - Spacing: `--space-xs` through `--space-3xl`
    - Border radius: `--radius` (2px — sharp, terminal feel)
  - **@font-face declarations**: Fira Code (400, 500, 700) + VT323 (400), all `font-display: swap`. Since plain `.css` files cannot use Liquid tags, the `@font-face` declarations must go in an inline `<style>` block in `layout/theme.liquid` where Liquid's `{{ 'filename.woff2' | asset_url }}` filter works. The `theme.css` file then uses `font-family` references normally. This is the standard Shopify pattern — Dawn does the same in theme.liquid.
  - **CSS Reset/Base**: minimal reset (box-sizing, margin, list-style), `html { background-color: #000 }`, `body` base styles
  - **Typography**: headings (VT323, uppercase, letter-spacing, glow), body text (Fira Code), links (green, underline on hover)
  - **Layout utilities**: `.container` (max-width 1200px, centered), `.grid` (CSS Grid, responsive columns), `.flex` helpers
  - **Component styles**:
    - Buttons: `.btn` (green border, transparent bg, green text, glow on hover), `.btn--primary` (filled green)
    - Forms: inputs with dark bg, green border, green focus glow
    - Cards: `.product-card` (dark panel bg, border, hover glow)
    - Navigation: horizontal links, active state glow
    - Badges/tags: small green-bordered pills
  - **Scanline overlay**: `body::after` with `linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)`, `background-size: 100% 4px`, `pointer-events: none`, `opacity: 0.3`, `position: fixed`, `inset: 0`, `z-index: 9999`
    - Controlled by `body.scanlines-enabled` class
  - **Text glow**: `.glow` utility class with `text-shadow: 0 0 5px rgba(0,255,65,0.4), 0 0 10px rgba(0,255,65,0.2)`
  - **Responsive breakpoints**: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide)
  - **Accessibility**:
    - `@media (prefers-reduced-motion: reduce)` — disable ALL animations, transitions, scanline overlay
    - Focus styles: visible green outline on all interactive elements
    - Skip-to-content link
    - All text meets WCAG AA contrast (4.5:1 for body, 3:1 for large text)
  - **Print styles**: basic `@media print` (white bg, black text, no effects)

  **Must NOT do**:
  - Do NOT create additional CSS files — everything in `theme.css`
  - Do NOT use CSS-in-JS or inline styles (except critical `background-color` on `<html>`)
  - Do NOT use CSS nesting (browser support) — flat selectors only
  - Do NOT add page-specific section styles yet — only the design system and reusable components
  - Do NOT set opacity of scanline overlay above 0.3 (readability)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Core design system work — colors, typography, spacing, components
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Expert in CSS design systems, responsive design, accessibility patterns
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not testing yet, building CSS
    - `git-master`: No git operations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential)
  - **Blocks**: Tasks 4, 5, 6, 7, 8, 9, 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - Dawn `assets/base.css` — reference for CSS Custom Properties pattern, reset approach, component naming
  - Dawn CSS architecture — how Dawn structures component styles in a single file

  **Documentation References**:
  - Shopify asset URL filter: `https://shopify.dev/docs/api/liquid/filters/asset_url` — for `{{ 'file.woff2' | asset_url }}` in @font-face
  - WCAG contrast requirements: `https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html`

  **External References**:
  - CRT scanline CSS technique: `linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)` with `background-size: 100% 4px` — from HairyDuck/terminal repo
  - Text glow technique: multi-layered `text-shadow` with rgba green values

  **Acceptance Criteria**:

  ```bash
  # File exists and is reasonably sized
  test -f assets/theme.css && echo "PASS" || echo "FAIL"
  wc -c assets/theme.css
  # Assert: > 2000 bytes (substantive), < 51200 bytes (< 50KB budget)

  # Contains required CSS custom properties
  grep -c "\-\-color-accent" assets/theme.css
  # Assert: >= 1
  grep -c "\-\-font-body" assets/theme.css
  # Assert: >= 1

  # Contains @font-face declarations (in theme.liquid inline style, not theme.css)
  grep -c "@font-face" layout/theme.liquid
  # Assert: >= 4 (3 Fira Code weights + 1 VT323)

  # Contains prefers-reduced-motion
  grep -c "prefers-reduced-motion" assets/theme.css
  # Assert: >= 1

  # Contains scanline overlay
  grep -c "pointer-events:\s*none" assets/theme.css
  # Assert: >= 1

  # No CSS nesting used (check for & combinator outside strings)
  # Manual check: search for nested selectors

  # Theme check still passes
  shopify theme check --fail-level error
  # Assert: 0 errors
  ```

  **Commit**: YES
  - Message: `feat(css): implement Matrix terminal design system with typography, colors, and effects`
  - Files: `assets/theme.css`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 4. Homepage Sections

  **What to do**:
  - Create `sections/hero.liquid`:
    - Full-width dark panel with large VT323 heading (store name / tagline)
    - Typing animation target element (`.typewriter`)
    - Subtext in Fira Code
    - CTA button linking to collection
    - Schema: heading text, subtext, button text, button link, enable typing animation (boolean)
  - Create `sections/featured-collection.liquid`:
    - Section title with glow
    - Grid of product cards (uses `{% render 'product-card' %}` snippet)
    - Schema: collection picker, number of products (4/8/12), section title
  - Create `sections/rich-text.liquid`:
    - Generic text section for homepage use (about blurb, announcements)
    - Schema: heading, body richtext, text alignment
  - Create `snippets/product-card.liquid`:
    - Product image (clean, no filter), title, price, compare-at price (strikethrough)
    - Link to product page
    - Uses `.product-card` CSS class from theme.css
    - Accepts `product` variable via `{% render 'product-card', product: product %}`
  - Update `templates/index.json` to reference hero, featured-collection, rich-text sections with default order

  **Must NOT do**:
  - Do NOT add parallax, carousel/slider, or video sections
  - Do NOT implement the actual typing JS animation here (Task 9)
  - Do NOT add more than 3 homepage sections
  - Do NOT add hover effects beyond what's defined in theme.css

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Liquid templating with visual layout and Shopify section schemas
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Section layout, product card design, responsive grid
  - **Skills Evaluated but Omitted**:
    - `playwright`: No testing at build stage

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5, 6, 7)
  - **Blocks**: Task 9 (typing animation targets the hero)
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Dawn `sections/featured-collection.liquid` — section schema pattern for collection picker, product loop
  - Dawn `sections/rich-text.liquid` — generic text section schema pattern
  - Dawn `snippets/card-product.liquid` — product card rendering pattern (image, title, price)

  **Documentation References**:
  - Section schema settings: `https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema`
  - Collection Liquid object: `https://shopify.dev/docs/api/liquid/objects/collection`
  - Product Liquid object: `https://shopify.dev/docs/api/liquid/objects/product`
  - Image tag: `https://shopify.dev/docs/api/liquid/filters/image_tag` — responsive image handling

  **Acceptance Criteria**:

  ```bash
  # Section files exist
  test -f sections/hero.liquid && echo "PASS" || echo "FAIL"
  test -f sections/featured-collection.liquid && echo "PASS" || echo "FAIL"
  test -f sections/rich-text.liquid && echo "PASS" || echo "FAIL"
  test -f snippets/product-card.liquid && echo "PASS" || echo "FAIL"

  # Sections have schemas
  grep -c "{% schema %}" sections/hero.liquid
  # Assert: 1
  grep -c "{% schema %}" sections/featured-collection.liquid
  # Assert: 1

  # Product card uses render (not include)
  grep -c "{% render 'product-card'" sections/featured-collection.liquid
  # Assert: >= 1

  # Index template references sections
  python3 -c "import json; d=json.load(open('templates/index.json')); assert len(d.get('order',[])) >= 1; print('PASS')"

  # Theme check passes
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(home): add hero, featured collection, and rich text homepage sections`
  - Files: `sections/hero.liquid`, `sections/featured-collection.liquid`, `sections/rich-text.liquid`, `snippets/product-card.liquid`, `templates/index.json`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 5. Collection + Search Sections

  **What to do**:
  - Create `sections/collection-template.liquid`:
    - Collection title with glow
    - Product grid using `{% render 'product-card' %}` for each product in `collection.products`
    - Pagination using `{% paginate %}` tag (products per page from schema)
    - Schema: products per page (12/24/36), grid columns (2/3/4)
  - Create `snippets/pagination.liquid`:
    - Previous / page numbers / next links
    - Terminal-style: `< prev | 1 | 2 | 3 | next >`
    - Accepts `paginate` object
  - Create `sections/search-template.liquid`:
    - Search form with input field and submit button
    - Results grid using product cards (reuse `product-card` snippet)
    - No-results state: "NO RESULTS FOUND" message in terminal style
    - Schema: results per page
  - Update `templates/collection.json` and `templates/search.json` to reference their sections

  **Must NOT do**:
  - Do NOT add filtering (by tag, price, vendor, etc.)
  - Do NOT add sorting (by price, date, alphabetical)
  - Do NOT add infinite scroll or load-more
  - Do NOT add quick-view modals
  - Do NOT add AJAX/predictive search

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Liquid templating with grid layout and pagination logic
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Grid layout, pagination UX
  - **Skills Evaluated but Omitted**:
    - `playwright`: No testing at build stage

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 6, 7)
  - **Blocks**: None
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Dawn `sections/main-collection-product-grid.liquid` — collection product loop + pagination pattern
  - Dawn `snippets/pagination.liquid` — pagination Liquid logic

  **Documentation References**:
  - Paginate tag: `https://shopify.dev/docs/api/liquid/tags/paginate`
  - Search object: `https://shopify.dev/docs/api/liquid/objects/search`
  - Collection filtering (for reference of what NOT to do): `https://shopify.dev/docs/storefronts/themes/navigation-search/filtering`

  **Acceptance Criteria**:

  ```bash
  # Files exist
  test -f sections/collection-template.liquid && echo "PASS" || echo "FAIL"
  test -f sections/search-template.liquid && echo "PASS" || echo "FAIL"
  test -f snippets/pagination.liquid && echo "PASS" || echo "FAIL"

  # Sections have schemas
  grep -c "{% schema %}" sections/collection-template.liquid
  # Assert: 1

  # Uses paginate tag
  grep -c "{% paginate" sections/collection-template.liquid
  # Assert: >= 1

  # Uses render for product card
  grep -c "{% render 'product-card'" sections/collection-template.liquid
  # Assert: >= 1

  # No filtering/sorting code
  grep -c "sort_by" sections/collection-template.liquid
  # Assert: 0

  # Theme check
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(collection): add collection grid, search results, and pagination`
  - Files: `sections/collection-template.liquid`, `sections/search-template.liquid`, `snippets/pagination.liquid`, `templates/collection.json`, `templates/search.json`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 6. Product Detail Section + product.js

  **What to do**:
  - Create `sections/product-template.liquid`:
    - Two-column layout: image gallery (left), product info (right)
    - Product images: clean display, no Matrix filter. Use `{{ image | image_url }}` with responsive srcset
    - Product title (VT323, glow), vendor, price (with compare-at strikethrough)
    - Variant selector: radio buttons grouped by option (Size, Color, etc.)
    - Quantity input (number, min 1)
    - Add to Cart button (`.btn--primary`), disabled state when unavailable
    - Product description (rich text)
    - Schema: enable quantity selector (boolean)
  - Create `assets/product.js`:
    - Web Component: `<product-form>` extending `HTMLElement`
    - Variant selection logic: map selected options → matching variant
    - Update price, compare-at price, availability on variant change
    - Update URL with `?variant=ID` on selection change
    - Add to cart via fetch to `${window.Shopify.routes.root}cart/add.js`
    - On success: redirect to `/cart` (page-based cart)
    - On error: show inline error message
    - Use `customElements.define('product-form', ProductForm)`
  - Update `templates/product.json` to reference the section

  **Must NOT do**:
  - Do NOT add color swatches — use radio buttons or native selects only
  - Do NOT add size guide or measurement chart
  - Do NOT add stock/inventory counter
  - Do NOT add image zoom or lightbox
  - Do NOT add related products or recently viewed
  - Do NOT add reviews section
  - Product images must be shown CLEAN — no green tint, no scanline overlay on images

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex section with interactive JS (variant picker + cart), product layout
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Product page layout, form UX, variant interaction pattern
  - **Skills Evaluated but Omitted**:
    - `playwright`: Build first, test in Task 10

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 5, 7)
  - **Blocks**: None
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Dawn `sections/main-product.liquid` — product section layout, variant rendering, image gallery structure
  - Dawn `assets/product-form.js` — Web Component pattern for product form, variant selection, cart submission
  - Dawn `assets/global.js` — base Web Component patterns and utility functions

  **API/Type References**:
  - Cart Add API: `POST /cart/add.js` — `{ items: [{ id: variant_id, quantity: qty }] }`
  - Product JSON: `{{ product | json }}` — full product data for JS variant mapping
  - `product.variants` Liquid object — variant ID, price, available, options

  **Documentation References**:
  - Product form: `https://shopify.dev/docs/storefronts/themes/product-merchandising/variants`
  - Cart API: `https://shopify.dev/docs/api/ajax/reference/cart`
  - Image URL filter: `https://shopify.dev/docs/api/liquid/filters/image_url`
  - Responsive images: `https://shopify.dev/docs/storefronts/themes/best-practices/performance#images`

  **Acceptance Criteria**:

  ```bash
  # Files exist
  test -f sections/product-template.liquid && echo "PASS" || echo "FAIL"
  test -f assets/product.js && echo "PASS" || echo "FAIL"

  # Section has schema
  grep -c "{% schema %}" sections/product-template.liquid
  # Assert: 1

  # JS uses Web Components
  grep -c "customElements.define" assets/product.js
  # Assert: >= 1

  # JS uses Shopify routes for cart
  grep -c "Shopify.routes.root" assets/product.js
  # Assert: >= 1

  # JS file size
  wc -c assets/product.js
  # Assert: < 15000 bytes

  # No color swatches
  grep -ci "swatch" sections/product-template.liquid
  # Assert: 0

  # Theme check
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(product): add product detail section with variant picker and cart integration`
  - Files: `sections/product-template.liquid`, `assets/product.js`, `templates/product.json`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 7. Cart Section + Global JS (theme.js)

  **What to do**:
  - Create `sections/cart-template.liquid`:
    - Cart line items table/list: product image (thumbnail), title, variant, price, quantity input, line total, remove button
    - Cart totals: subtotal, note about taxes/shipping at checkout
    - Checkout button (links to Shopify checkout)
    - Empty cart state: "CART EMPTY" terminal-style message with link to continue shopping
    - Schema: enable cart note (boolean)
  - Create `assets/theme.js`:
    - Web Component: `<mobile-menu>` — hamburger toggle, slide-out nav, body scroll lock
    - Cart quantity update: fetch to `${window.Shopify.routes.root}cart/change.js` with `{ id: key, quantity: qty }`
    - Cart item remove: set quantity to 0
    - Section Rendering API: after cart update, re-render cart section via `?sections=cart-template`
    - Accessibility: focus traps for mobile menu, aria attributes
    - Use `customElements.define` for each component
  - Update `sections/header.liquid`:
    - Logo / store name (VT323, glow)
    - Main navigation links (from `linklists['main-menu']`)
    - Cart icon with item count badge
    - Mobile menu toggle button (`<mobile-menu>` wrapper)
    - Schema: logo image (optional), menu linklist picker
  - Update `sections/footer.liquid`:
    - Footer navigation links
    - Copyright with `{{ 'now' | date: '%Y' }}`
    - ASCII art decorative element (small, e.g., `> SYSTEM ONLINE_`)
    - Schema: footer menu linklist, copyright text
  - Update `templates/cart.json` to reference cart-template section

  **Must NOT do**:
  - Do NOT add cart drawer — page-based only
  - Do NOT add upsells, cross-sells, or "you may also like"
  - Do NOT add shipping calculator or discount code field
  - Do NOT add cart-level quantity selectors beyond per-line-item
  - Do NOT create more than `theme.js` for global JS — no separate `cart.js`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Interactive cart + navigation JS, multiple Liquid sections, responsive layout
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Cart UX, mobile navigation, responsive header/footer
  - **Skills Evaluated but Omitted**:
    - `playwright`: Build first, test in Task 10

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 5, 6)
  - **Blocks**: None
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Dawn `sections/main-cart-items.liquid` — cart line items rendering, quantity update form
  - Dawn `sections/cart-drawer.liquid` — Section Rendering API pattern (reuse for page cart)
  - Dawn `sections/header.liquid` — navigation, cart count, mobile menu toggle pattern
  - Dawn `assets/cart.js` — Web Component for cart updates via fetch API

  **API/Type References**:
  - Cart Change API: `POST /cart/change.js` — `{ id: line_item_key, quantity: new_qty }`
  - Cart object: `{{ cart | json }}` — items, total_price, item_count
  - Section Rendering API: `?sections=section-id` — re-render specific section via AJAX
  - Linklist: `{{ linklists['main-menu'] }}` — navigation links

  **Documentation References**:
  - Cart API: `https://shopify.dev/docs/api/ajax/reference/cart`
  - Section Rendering API: `https://shopify.dev/docs/api/section-rendering`
  - Navigation: `https://shopify.dev/docs/storefronts/themes/navigation-search/navigation`

  **Acceptance Criteria**:

  ```bash
  # Files exist
  test -f sections/cart-template.liquid && echo "PASS" || echo "FAIL"
  test -f assets/theme.js && echo "PASS" || echo "FAIL"

  # Cart section has schema
  grep -c "{% schema %}" sections/cart-template.liquid
  # Assert: 1

  # Header and footer have schemas
  grep -c "{% schema %}" sections/header.liquid
  # Assert: 1
  grep -c "{% schema %}" sections/footer.liquid
  # Assert: 1

  # theme.js uses Web Components
  grep -c "customElements.define" assets/theme.js
  # Assert: >= 1

  # theme.js uses Shopify routes
  grep -c "Shopify.routes.root" assets/theme.js
  # Assert: >= 1

  # theme.js size
  wc -c assets/theme.js
  # Assert: < 30000 bytes

  # No cart drawer
  grep -ci "drawer" sections/cart-template.liquid
  # Assert: 0

  # Theme check
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(cart): add cart page, header nav, footer, and global JS with mobile menu`
  - Files: `sections/cart-template.liquid`, `assets/theme.js`, `sections/header.liquid`, `sections/footer.liquid`, `templates/cart.json`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 8. Blog, About, Contact, 404, Password, Gift Card Sections

  **What to do**:
  - Create `sections/blog-template.liquid`:
    - Blog title, grid of article cards (image, title, date, excerpt)
    - Pagination via `{% paginate blog.articles %}`
    - Schema: articles per page
  - Create `sections/article-template.liquid`:
    - Article title (VT323, glow), author, date
    - Featured image (clean)
    - Article body content (rich text)
    - Back to blog link
    - Schema: show author (boolean), show date (boolean)
  - Create `sections/page-template.liquid`:
    - Page title, page content (`{{ page.content }}`)
    - Generic for About and any custom pages
    - Schema: show title (boolean)
  - Create `sections/contact-form.liquid`:
    - Contact form using `{% form 'contact' %}`
    - Name, email, message fields
    - Submit button
    - Schema: heading text
  - Create `sections/404-template.liquid`:
    - Terminal-style 404 message: `> ERROR 404: PAGE NOT FOUND`
    - ASCII art decoration (small, on-theme)
    - Search form and/or link to homepage
    - No schema needed (static)
  - Update `templates/gift_card.liquid`:
    - Ensure it properly renders gift card code, balance, QR code
    - Dark theme styling applied
  - Update `templates/password.json`:
    - Create `sections/password-template.liquid`
    - Store name, password form (`{% form 'storefront_password' %}`), message
    - Dark theme, minimal styling
  - Update all JSON templates (`blog.json`, `article.json`, `page.json`, `page.contact.json`, `404.json`, `password.json`) to reference their sections

  **Must NOT do**:
  - Do NOT add blog comments or social sharing
  - Do NOT add related articles or tag filtering
  - Do NOT add complex contact form fields beyond name/email/message
  - Do NOT add elaborate 404 animations

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Many sections to create but each is straightforward Liquid templating
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Page layout, form design, content presentation
  - **Skills Evaluated but Omitted**:
    - `playwright`: Build stage, not test

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Dawn `sections/main-blog.liquid` — blog article loop + pagination
  - Dawn `sections/main-article.liquid` — article rendering
  - Dawn `sections/main-page.liquid` — generic page template
  - Dawn `sections/contact-form.liquid` — contact form Liquid pattern
  - Dawn `templates/404.json` — 404 page structure
  - Dawn `templates/gift_card.liquid` — gift card Liquid objects and structure

  **Documentation References**:
  - Blog object: `https://shopify.dev/docs/api/liquid/objects/blog`
  - Article object: `https://shopify.dev/docs/api/liquid/objects/article`
  - Gift card object: `https://shopify.dev/docs/api/liquid/objects/gift_card`
  - Form tag (contact): `https://shopify.dev/docs/api/liquid/tags/form#contact`
  - Form tag (storefront password): `https://shopify.dev/docs/api/liquid/tags/form#storefront_password`

  **Acceptance Criteria**:

  ```bash
  # All section files exist
  for f in blog-template article-template page-template contact-form 404-template password-template; do
    test -f "sections/$f.liquid" && echo "PASS: $f" || echo "FAIL: $f"
  done

  # All sections have schemas (except 404 which is optional)
  for f in blog-template article-template page-template contact-form; do
    grep -c "{% schema %}" "sections/$f.liquid" | xargs -I{} test {} -ge 1 && echo "PASS: $f schema" || echo "FAIL: $f schema"
  done

  # Gift card template has required objects
  grep -c "gift_card.code" templates/gift_card.liquid
  # Assert: >= 1
  grep -c "gift_card.balance" templates/gift_card.liquid
  # Assert: >= 1

  # No blog comments
  grep -ci "comment" sections/blog-template.liquid sections/article-template.liquid
  # Assert: 0 (or only in non-functional contexts)

  # Theme check
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(pages): add blog, article, about, contact, 404, password, and gift card sections`
  - Files: `sections/blog-template.liquid`, `sections/article-template.liquid`, `sections/page-template.liquid`, `sections/contact-form.liquid`, `sections/404-template.liquid`, `sections/password-template.liquid`, `templates/gift_card.liquid`, `templates/blog.json`, `templates/article.json`, `templates/page.json`, `templates/page.contact.json`, `templates/404.json`, `templates/password.json`
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 9. Matrix Effects — Rain Canvas + Typing Animation

  **What to do**:
  - Create `assets/matrix-rain.js`:
    - Canvas-based digital rain effect
    - Characters: katakana subset + digits + latin letters
    - Green color with varying opacity for depth (brighter = foreground)
    - Max 60 columns, `requestAnimationFrame` loop
    - Canvas positioned `fixed`, behind content (`z-index: -1`), `pointer-events: none`
    - **Disable conditions** (check ALL before starting):
      - `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → don't start
      - `window.innerWidth < 768` → don't start
      - `!document.body.classList.contains('rain-enabled')` → don't start
    - Listen for resize: kill on < 768px, restart on >= 768px
    - Listen for `prefers-reduced-motion` change
    - Self-contained: creates its own `<canvas>`, appends to `document.body`
    - Efficient: reuse single `requestAnimationFrame`, clear with semi-transparent black rect (trail effect)
  - Add typing animation to `assets/theme.js` (or inline in hero section):
    - Target: `.typewriter` element in hero section
    - Effect: characters appear one by one with blinking cursor
    - Speed: ~80ms per character
    - Cursor: `border-right: 2px solid var(--color-accent)` with `step-end` blink animation
    - Only runs once on page load (no loop)
    - **Disable**: skip if `prefers-reduced-motion: reduce` — show full text immediately
    - Only initialize if `.typewriter` element exists on page
  - Update `layout/theme.liquid`:
    - Add `<script src="{{ 'matrix-rain.js' | asset_url }}" defer></script>` (load only on homepage via Liquid condition, or let JS self-check)
    - Add class `rain-enabled` and `scanlines-enabled` to `<body>` based on theme settings
  - Add supporting CSS to `assets/theme.css`:
    - `.typewriter` styles: `overflow: hidden`, `white-space: nowrap`, `border-right` cursor
    - `@keyframes blink-caret` for cursor
    - Canvas positioning styles

  **Must NOT do**:
  - Do NOT add typing animation to any page other than homepage hero
  - Do NOT add matrix rain to pages other than homepage
  - Do NOT exceed 5KB for matrix-rain.js
  - Do NOT use external animation libraries
  - Do NOT add page transition animations
  - Do NOT add hover animations beyond what's in theme.css
  - Do NOT make rain full-opacity — it must be subtle background decoration

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Canvas animation, CSS animation, performance-sensitive visual effects
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Animation performance, accessibility (reduced motion), visual effects
  - **Skills Evaluated but Omitted**:
    - `playwright`: Build stage

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 8)
  - **Blocks**: Task 10
  - **Blocked By**: Task 4 (typing animation targets hero section element)

  **References**:

  **Pattern References**:
  - Canvas matrix rain implementations: search for `requestAnimationFrame` + character column array pattern
  - CSS typing animation: `@keyframes typing { from { width: 0 } to { width: 100% } }` + `steps()` timing

  **External References**:
  - Matrix rain technique: Canvas 2D context, `fillRect` with `rgba(0,0,0,0.05)` for trail effect, `fillText` for characters
  - `prefers-reduced-motion` guide: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion`
  - `requestAnimationFrame` best practices: `https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame`

  **Acceptance Criteria**:

  ```bash
  # Files exist
  test -f assets/matrix-rain.js && echo "PASS" || echo "FAIL"

  # matrix-rain.js size within budget
  wc -c assets/matrix-rain.js
  # Assert: < 5120 bytes (5KB)

  # matrix-rain.js checks for reduced motion
  grep -c "prefers-reduced-motion" assets/matrix-rain.js
  # Assert: >= 1

  # matrix-rain.js checks viewport width
  grep -c "768" assets/matrix-rain.js
  # Assert: >= 1

  # Typing animation checks reduced motion
  grep -c "prefers-reduced-motion" assets/theme.js
  # Assert: >= 1

  # CSS has typewriter styles
  grep -c "typewriter" assets/theme.css
  # Assert: >= 1

  # CSS has blink-caret keyframes
  grep -c "blink-caret" assets/theme.css
  # Assert: >= 1

  # Theme check
  shopify theme check --fail-level error
  ```

  **Commit**: YES
  - Message: `feat(effects): add matrix rain canvas and typing animation with a11y support`
  - Files: `assets/matrix-rain.js`, `assets/theme.js` (updated), `assets/theme.css` (updated), `layout/theme.liquid` (updated)
  - Pre-commit: `shopify theme check --fail-level error`

---

- [ ] 10. Customer Templates + Empty States + Final QA

  **What to do**:
  - Style all 7 customer templates with dark theme + green accents:
    - `login.liquid`: email/password form, "Forgot password?" link, "Create account" link
    - `register.liquid`: first name, last name, email, password form
    - `account.liquid`: order history list, account details
    - `addresses.liquid`: address list, add/edit address form
    - `order.liquid`: order details, line items, totals, shipping/billing address
    - `activate_account.liquid`: password set form
    - `reset_password.liquid`: new password form
    - All using `{% form %}` with appropriate form type
  - Verify empty states across theme:
    - Empty cart: message + continue shopping link
    - Empty collection: "No products found" message
    - No search results: "No results for [query]" message
    - 404: error message + navigation help
  - Add `sections/apps.liquid`:
    - Required app block section: `{% for block in section.blocks %}{% render block %}{% endfor %}`
    - Schema with `"blocks": [{ "type": "@app" }]`
  - Final quality pass:
    - Run `shopify theme check --fail-level error`
    - Verify all JSON templates reference valid section types
    - Verify all locale keys used in Liquid exist in `en.default.json`
    - Verify `settings_data.json` preset matches `settings_schema.json` structure

  **Must NOT do**:
  - Do NOT add Matrix effects (rain, typing, scanlines) to customer templates
  - Do NOT add social login buttons
  - Do NOT add customer account features beyond Shopify defaults
  - Do NOT add app blocks beyond the required `apps.liquid` section

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Final integration task touching many files, QA verification across entire theme
  - **Skills**: [`frontend-ui-ux`, `playwright`]
    - `frontend-ui-ux`: Form styling, empty state UX, visual consistency
    - `playwright`: Full functional testing of cart flow, page rendering, accessibility audits
  - **Skills Evaluated but Omitted**:
    - `git-master`: Final commit but straightforward

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential — must run LAST)
  - **Blocks**: None (final task)
  - **Blocked By**: All previous tasks (1-9)

  **References**:

  **Pattern References**:
  - Dawn `templates/customers/*.liquid` — all 7 customer template patterns with form tags
  - Dawn `sections/apps.liquid` — required app block section pattern

  **Documentation References**:
  - Customer templates: `https://shopify.dev/docs/storefronts/themes/architecture/templates/customers`
  - Form tag types: `https://shopify.dev/docs/api/liquid/tags/form` — customer_login, create_customer, customer_address, etc.
  - App blocks: `https://shopify.dev/docs/storefronts/themes/architecture/sections/app-blocks`

  **Acceptance Criteria**:

  ```bash
  # All customer templates styled (not empty/minimal)
  for f in login register account addresses order activate_account reset_password; do
    lines=$(wc -l < "templates/customers/$f.liquid")
    test "$lines" -gt 10 && echo "PASS: $f ($lines lines)" || echo "FAIL: $f too short ($lines lines)"
  done

  # Apps section exists
  test -f sections/apps.liquid && echo "PASS" || echo "FAIL"
  grep -c "@app" sections/apps.liquid
  # Assert: >= 1

  # Final theme check — ZERO errors
  shopify theme check --fail-level error
  # Assert: 0 errors

  # All JSON templates reference existing sections
  python3 -c "
  import json, os, glob
  errors = []
  for f in glob.glob('templates/*.json'):
      d = json.load(open(f))
      for name, sec in d.get('sections', {}).items():
          stype = sec.get('type', '')
          if stype.startswith('apps'): continue
          if not os.path.exists(f'sections/{stype}.liquid'):
              errors.append(f'{f}: section type \"{stype}\" has no matching file')
  if errors:
      for e in errors: print(f'FAIL: {e}')
  else:
      print('PASS: all section types resolve')
  "

  # Locale file has content
  python3 -c "import json; d=json.load(open('locales/en.default.json')); assert len(d) >= 5; print(f'PASS: {len(d)} top-level keys')"
  ```

  **Playwright Functional Tests** (via playwright skill):
  ```
  # Full add-to-cart flow
  1. Navigate to /collections/all
  2. Click first product card
  3. Assert: product page loads (title visible)
  4. Click "Add to Cart"
  5. Navigate to /cart
  6. Assert: product in cart
  7. Change quantity to 2
  8. Assert: totals update
  9. Remove item
  10. Assert: empty cart state visible

  # All page types render without JS errors
  For each: /, /collections/all, /products/[first-product], /cart, /pages/about, /blogs/news, /search?q=test, /404-test
  1. Navigate to URL
  2. Assert: no console errors
  3. Assert: page content rendered (not blank)
  4. Screenshot to .sisyphus/evidence/

  # Mobile responsive check
  1. Set viewport 375x812
  2. Navigate to / → Assert: no horizontal overflow
  3. Navigate to /collections/all → Assert: grid adapts
  4. Navigate to /products/[first] → Assert: Add to Cart visible

  # Accessibility audit
  For each page type:
  1. Run Lighthouse accessibility
  2. Assert: score >= 90

  # Reduced motion
  1. Emulate prefers-reduced-motion: reduce
  2. Navigate to /
  3. Assert: no canvas element visible or animating
  4. Assert: no CSS animations running
  5. Assert: typewriter text fully visible (no animation)
  ```

  **Commit**: YES
  - Message: `feat(theme): complete customer templates, empty states, app blocks, and final QA`
  - Files: `templates/customers/*.liquid`, `sections/apps.liquid`, any fixes from QA
  - Pre-commit: `shopify theme check --fail-level error`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1+2 | `feat(theme): scaffold theme skeleton with all templates, config, and locales` | layout/, templates/, config/, locales/, assets/*.woff2 | `shopify theme check` |
| 3 | `feat(css): implement Matrix terminal design system` | assets/theme.css | `shopify theme check` + size check |
| 4 | `feat(home): add hero, featured collection, and rich text sections` | sections/hero.liquid, snippets/product-card.liquid | `shopify theme check` |
| 5 | `feat(collection): add collection grid, search, and pagination` | sections/collection-template.liquid | `shopify theme check` |
| 6 | `feat(product): add product detail with variant picker` | sections/product-template.liquid, assets/product.js | `shopify theme check` |
| 7 | `feat(cart): add cart page, header, footer, and global JS` | sections/cart-template.liquid, assets/theme.js | `shopify theme check` |
| 8 | `feat(pages): add blog, 404, password, gift card sections` | sections/*-template.liquid | `shopify theme check` |
| 9 | `feat(effects): add matrix rain and typing animation` | assets/matrix-rain.js | `shopify theme check` + size check |
| 10 | `feat(theme): complete customer templates and final QA` | templates/customers/*.liquid | Full test suite |

---

## Success Criteria

### Verification Commands
```bash
# Structure valid
shopify theme check --fail-level error  # 0 errors

# Asset budgets met
wc -c assets/theme.css      # < 50KB
wc -c assets/theme.js       # < 30KB
wc -c assets/matrix-rain.js # < 5KB
wc -c assets/product.js     # < 15KB

# All required files present
ls templates/*.json | wc -l          # >= 12
ls templates/customers/*.liquid | wc -l  # >= 7
ls sections/*.liquid | wc -l         # >= 15
test -f templates/gift_card.liquid   # exists
```

### Final Checklist
- [ ] All "Must Have" features present and functional
- [ ] All "Must NOT Have" guardrails respected (no drawer, no filters, no extras)
- [ ] `shopify theme check --fail-level error` → 0 errors
- [ ] All pages render at 1440px and 375px without overflow
- [ ] Lighthouse accessibility >= 90 on all page types
- [ ] `prefers-reduced-motion` disables ALL effects
- [ ] Cart flow works end-to-end (add → view → update → remove → empty state)
- [ ] All empty states render properly
- [ ] No `{% include %}` tags anywhere (only `{% render %}`)
- [ ] No external CDN requests (fonts self-hosted)
- [ ] Max 3 JS files, 1 CSS file
- [ ] Scanline overlay has `pointer-events: none`
- [ ] `<html>` has `background-color: #000`

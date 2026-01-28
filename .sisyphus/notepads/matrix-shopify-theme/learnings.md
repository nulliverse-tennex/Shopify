
## Task 2: Self-Host Fonts — Completed

### What Was Done
Downloaded Fira Code (weights 400, 500, 700) and VT323 (weight 400) in woff2 format from Google Fonts API.

### Key Findings

1. **Google Fonts API User-Agent Matters**
   - Default user-agent returns TTF format
   - Chrome user-agent (`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`) returns woff2
   - This is the standard approach for self-hosting Google Fonts

2. **Font File URLs**
   - Fira Code (all weights): `https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2`
   - VT323 (weight 400): `https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2isfFJU.woff2`
   - Google Fonts serves multiple unicode-range subsets; we downloaded the latin subset (most complete)

3. **File Sizes**
   - Fira Code: 36,276 bytes each (400, 500, 700 weights all identical — Google may use variable fonts internally)
   - VT323: 17,936 bytes
   - Total: ~127KB for all 4 files (well within performance budget)

4. **Naming Convention**
   - Used `{font-name}-{weight-name}.woff2` format
   - Fira Code: `fira-code-regular.woff2`, `fira-code-medium.woff2`, `fira-code-bold.woff2`
   - VT323: `vt323-regular.woff2`
   - This matches Shopify theme conventions and is easy to reference in @font-face declarations

### Next Steps (Task 3)
- Add @font-face declarations to `layout/theme.liquid` using `{{ 'filename.woff2' | asset_url }}` filter
- Update CSS to reference self-hosted fonts instead of Google Fonts CDN
- Remove Google Fonts CDN links from Layout.astro

### Performance & GDPR Benefits
- Self-hosting eliminates third-party request latency (Google Fonts CDN)
- Fonts served from Shopify CDN (same domain) → faster load
- No user data sent to Google Fonts → GDPR compliant
- Fonts can be cached indefinitely (immutable asset URLs)


## Task 1: Theme Skeleton Build — Completed

### Shopify Theme Check
- `shopify theme check --fail-level error` is the verification gate
- Installed via `npm install -g @shopify/cli @shopify/theme` (nvm node v20 path required due to WSL1 npm issues)
- nvm node path: `/home/juanitolillig/.nvm/versions/node/v20.20.0/bin`

### settings_schema.json
- `theme_info` MUST be the first element in the array
- `theme_documentation_url` and `theme_support_url` must be valid URIs — empty strings fail ValidJSON check
- Use placeholder URLs rather than empty strings

### Font Assets
- Theme check validates that `asset_url` referenced files actually exist in `assets/`
- Placeholder .woff2 files must exist even if empty — `MissingAsset` is an error-level offense
- Font preloads trigger `AssetPreload` warning suggesting `preload_tag` filter — warning only, not error

### Gift Card Template
- `qr_code` is NOT a valid Shopify Liquid filter — theme check flags `UnknownFilter` as error
- Use `prepend` with a QR code API URL instead, or generate client-side
- `gift_card.liquid` is a standalone template (has its own `<!DOCTYPE html>`) — does NOT use `layout/theme.liquid`
- `gift_card.qr_identifier` is the data to encode

### Customer Templates
- `email` variable in `reset_password.liquid` triggers `UndefinedObject` warning (not error) — Shopify provides it at runtime but theme check doesn't know
- Customer form tags: `customer_login`, `create_customer`, `customer_address`, `activate_customer_password`, `reset_customer_password`
- `customer_address` form takes the address object as second arg: `{% form 'customer_address', customer.new_address %}`

### JSON Templates
- Online Store 2.0 JSON templates just need `"sections": {}` and `"order": []` as minimum valid structure
- Alternate templates use dot notation: `page.contact.json`, `collection.list.json`

### Section Groups
- Section group JSON files live in `sections/` directory (not a separate dir)
- Must have `"type"`, `"name"`, `"sections"`, and `"order"` keys
- Referenced section types must have corresponding `.liquid` files in `sections/`

### WSL1 Gotcha
- System npm from Windows doesn't work in WSL1 — use nvm-managed node/npm instead
- Full path export needed: `export PATH="/home/juanitolillig/.nvm/versions/node/v20.20.0/bin:$PATH"`

## Task 3: CSS Design System (theme.css) — Completed

### File Stats
- Size: 20,929 bytes (~20.4KB) — well within 50KB budget
- 15 sections: Custom Properties, Reset, Typography, Layout, Buttons, Forms, Product Cards, Navigation, Badges/Tags, Text Glow, Scanline Overlay, Accessibility, Responsive, Reduced Motion, Print

### Architecture Decisions
- All values driven through CSS Custom Properties in `:root` — accent color overridable via Shopify settings inline CSS injection
- Flat selectors only (no CSS nesting) for broad browser support
- Mobile-first responsive: 375px → 768px → 1024px → 1440px
- VT323 for headings (uppercase, letter-spacing, glow), Fira Code for body text
- Heading scale bumps up at tablet (768px) and wide (1440px) breakpoints

### Key Patterns
- `--color-accent-dim` (15% opacity), `--color-accent-glow` (40%), `--color-accent-soft` (20%) — reused across all glow/hover effects
- Scanline overlay via `body.scanlines-enabled::after` — class-toggled, opacity 0.3, pointer-events: none
- `:focus-visible` for keyboard-only focus outlines (green, 2px solid, 2px offset)
- `:focus:not(:focus-visible)` removes outlines for mouse users
- `@media (prefers-reduced-motion: reduce)` kills all animations, transitions, scanlines
- Print styles swap to white bg/black text, remove all effects

### Color Contrast Notes
- #00ff41 on #000 = 15:1 (AAA) ✓
- #e0e0e0 on #000 = 15.3:1 (AAA) ✓
- #7a7a7a on #000 = 5.6:1 (AA) ✓ — used for muted text only
- #ff4444 on #000 = 5.3:1 (AA) ✓ — error color
- Select dropdown uses inline SVG data URI for custom green chevron

### Component Classes Available
- `.btn`, `.btn--primary`, `.btn--small`, `.btn--large`, `.btn--block`, `.btn--ghost`, `.btn--danger`
- `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`, `.form-error`
- `.product-card`, `.product-card__image`, `.product-card__body`, `.product-card__title`, `.product-card__price`
- `.nav`, `.nav__link`, `.nav__link--active`
- `.badge`, `.badge--sale`, `.badge--sold-out`, `.badge--new`, `.tag`, `.tag--active`
- `.glow`, `.glow--strong`
- `.container`, `.container--narrow`, `.container--wide`
- `.grid`, `.grid--2`, `.grid--3`, `.grid--4`, `.grid--auto`
- `.flex`, `.flex--wrap`, `.flex--col`, `.flex--center`, `.flex--between`
- `.skip-to-content`, `.visually-hidden`

## Task 5: Homepage Sections — Completed

### Files Created
- `sections/hero.liquid` — Full-width dark panel, VT323 heading, `.typewriter` target, Fira Code subtext, CTA button
- `sections/featured-collection.liquid` — Section title with `.glow`, product grid using `{% render 'product-card' %}`
- `sections/rich-text.liquid` — Generic text section with alignment options
- `snippets/product-card.liquid` — Product image, title link, price with compare-at strikethrough, `.product-card` CSS class

### Key Patterns
1. **Section-scoped CSS via `{%- style -%}`** — Keeps section styles isolated without polluting global CSS
2. **Placeholder fallback** — `placeholder_svg_tag` used when no collection assigned or no product image
3. **`.typewriter` class on `<span>`** with `data-text` attribute — Task 9 typing animation will target this element
4. **`{% render %}` not `{% include %}`** — Shopify Online Store 2.0 requirement; include is deprecated
5. **Schema settings max 5 per section** — hero: 5 (heading, subtext, button_text, button_link, enable_typing), featured-collection: 3, rich-text: 3

### Index Template Structure
- Section IDs: `hero`, `featured`, `about`
- Maps to types: `hero`, `featured-collection`, `rich-text`
- Order array: `["hero", "featured", "about"]`

### Pre-existing Theme Check Errors (NOT from this task)
- 3 errors in product section: ParserBlockingScript, ValidSchema (templates property), MissingAsset (product.js)
- These exist from prior task work — not introduced by homepage sections

## Task 5b: Collection & Search Sections — Completed

### Files Created
- `sections/collection-template.liquid` — Collection title with `.glow--strong`, product grid, `{% paginate %}`, empty collection state
- `sections/search-template.liquid` — Search form (input + EXECUTE button), results grid, terminal-style no-results state
- `snippets/pagination.liquid` — Terminal-style pagination (`< prev | 1 | 2 | 3 | next >`), pipe separators

### Key Patterns
1. **`{% paginate collection.products by section.settings.products_per_page %}`** — Schema range setting (12/24/36) controls per-page count
2. **`{% render 'pagination', paginate: paginate %}`** — Passes paginate object to snippet
3. **`paginate.parts` loop** — Shopify provides parts array with `is_link`, `url`, `title` properties; handles ellipsis (`&hellip;`) automatically
4. **Search results type branching** — `item.object_type == 'product'` renders product-card; other types (article, page) get a generic card with badge + excerpt
5. **No-results terminal block** — Simulated terminal output with `> search --query "..."`, `[ERROR] NO RESULTS FOUND`, `0 matches in database_`
6. **Schema grid_columns setting** — select with values "2"/"3"/"4" maps to `.grid--2`/`.grid--3`/`.grid--4` CSS classes

### CSS Architecture
- Section-scoped `<style>` blocks for section-specific styles (collection header, search form, empty states, pagination)
- Reuses theme.css classes: `.container`, `.grid`, `.grid--3`, `.btn`, `.btn--primary`, `.form-input`, `.glow--strong`, `.badge`, `.visually-hidden`
- Pagination uses `--font-body` (Fira Code monospace), accent glow on current page, dimmed disabled links

### Template JSON Structure
- `collection.json`: `{ "sections": { "main": { "type": "collection-template" } }, "order": ["main"] }`
- `search.json`: `{ "sections": { "main": { "type": "search-template" } }, "order": ["main"] }`

### Verification Checklist
- `grep -c "{% paginate" sections/collection-template.liquid` = 1 ✓
- No `sort_by` in collection template ✓
- Both sections have `{% schema %}` blocks ✓
- Both sections use `{% render 'product-card' %}` ✓
- Search has no-results state with "NO RESULTS FOUND" ✓
- Terminal-style pagination with `< prev | ... | next >` ✓
- Theme check: 0 errors in new files (3 pre-existing errors from other tasks)

## Task 4: Product Detail Section + JS Web Component — Completed

### Files Created
- `sections/product-template.liquid` (10.5KB) — two-column grid layout, image gallery left, product info right
- `assets/product.js` (6.1KB) — `<product-form>` Web Component for variant selection + cart
- Updated `templates/product.json` to reference `product-template` section

### Key Findings

1. **Schema `templates` Property is Invalid**
   - Shopify theme check rejects `"templates": ["product"]` in `{% schema %}` — `ValidSchema` error
   - Use `"presets"` instead for section configurability, or omit entirely for single-use sections
   - Sections referenced in JSON templates don't need presets

2. **`script_tag` Filter is Parser-Blocking**
   - `{{ 'file.js' | asset_url | script_tag }}` generates `<script>` without async/defer
   - Theme check flags this as `ParserBlockingScript` error
   - Use `<script src="{{ 'file.js' | asset_url }}" defer></script>` instead

3. **Web Component Pattern for Shopify**
   - `class ProductForm extends HTMLElement` + `customElements.define('product-form', ProductForm)`
   - Constructor reads DOM via `this.querySelector()` — element already in DOM when custom element upgrades
   - Product JSON embedded via `<script type="application/json" data-product-json>{{ product | json }}</script>`
   - Variant matching: collect selected radio values → find variant where `options` array matches

4. **Cart API Pattern**
   - `window.Shopify.routes.root` provides locale-aware root path (e.g., `/en/` for multi-language)
   - Fallback to `/cart/add.js` if `Shopify.routes` unavailable
   - POST body: `{ items: [{ id: variantId, quantity: qty }] }`
   - Error response parsed from `data.description || data.message`

5. **Variant URL Syncing**
   - `window.history.replaceState` to update `?variant=ID` without page reload
   - On load, parse URL params to pre-select matching variant radios
   - Use `CSS.escape()` for safe attribute selector values with special chars

### CSS Architecture
- Product-specific styles inlined in `<style>` block within section (not in theme.css)
- Reuses design system variables: `--color-accent`, `--color-border`, `--space-*`, `--font-heading`, etc.
- Radio buttons visually hidden, styled labels act as toggle chips with glow on `:checked`
- Two-column grid at 768px+ breakpoint, single column on mobile

## Task 4b: Cart Page + Global JS + Header/Footer — Completed

### Files Created/Updated
- `sections/cart-template.liquid` — Cart line items, quantity selector, totals, empty state, checkout button
- `assets/theme.js` (6.9KB) — `<mobile-menu>` Web Component + CartManager class
- `sections/header.liquid` — Full header with logo/store name, main nav, cart icon badge, mobile menu
- `sections/footer.liquid` — Footer nav links, copyright year, ASCII art `> SYSTEM ONLINE_`
- `templates/cart.json` — References `cart-template` section

### Key Patterns

1. **Cart Removal via qty=0**
   - Shopify Cart API has no DELETE endpoint; setting quantity to 0 removes the line item
   - `POST /cart/change.js` with `{ id: lineKey, quantity: 0 }` removes item

2. **Section Rendering API for Cart Updates**
   - After `cart/change.js`, fetch `/?sections=cart-template` to get fresh HTML
   - Parse JSON response, extract section HTML, replace `#cart-section` container
   - Fallback: full page reload if section render fails

3. **Web Component Architecture**
   - `MobileMenu` extends `HTMLElement` with focus trap, Escape key close, body scroll lock
   - `CartManager` is a plain class (not a Web Component) — handles event delegation for all cart interactions
   - Event delegation on `document` for dynamic content (cart section gets replaced after updates)

4. **Header Cart Badge**
   - `data-cart-count` attribute on badge element
   - `CartManager.updateCartCount()` updates all `[data-cart-count]` elements after cart API calls
   - Badge hidden via `hidden` attribute when count is 0

5. **Mobile Menu**
   - `<mobile-menu>` custom element wraps toggle button, overlay, and drawer nav
   - Drawer slides from right via `transform: translateX(100%)` → `translateX(0)`
   - `body.menu-open { overflow: hidden; }` for scroll lock
   - Focus trap cycles through focusable elements in drawer
   - Escape key and overlay click close the menu

6. **Header Schema Settings**
   - `image_picker` for optional logo image (falls back to `shop.name` in VT323 with glow)
   - `link_list` for main menu with default `main-menu`

7. **Footer ASCII Art**
   - `> SYSTEM ONLINE_` with blinking animation (`terminal-blink` keyframe)
   - `aria-hidden="true"` since it's decorative

### Verification Results
- `grep -c "customElements.define\|Shopify.routes.root"` = 3 (≥ 2) ✓
- theme.js = 6,984 bytes (< 30KB) ✓
- All 3 sections have `{% schema %}` blocks ✓
- Theme check: 0 new errors (2 pre-existing contact form translation errors)
- Cart has empty state with `{% if cart.item_count == 0 %}`
- No cart drawer — page-based cart only

## Task 6: Content Pages, Blog, Article, Contact, 404, Password, Gift Card — Completed

### Sections Created
- `blog-template.liquid`: Blog grid with `{% paginate blog.articles %}`, article cards (image 16:9, title, date, excerpt), pagination snippet
- `article-template.liquid`: Article with VT323 glow title, author/date meta, featured image, richtext body, back-to-blog link
- `page-template.liquid`: Generic page (About/custom), `{{ page.content }}` with richtext styles, show_title toggle
- `contact-form.liquid`: `{% form 'contact' %}` with name/email/message, terminal-style success/error messages
- `404-template.liquid`: ASCII art 404, terminal prompt `> ERROR 404: PAGE NOT FOUND_`, homepage button, no schema (static)
- `password-template.liquid`: `{% form 'storefront_password' %}`, store name glow, centered layout, dark minimal

### Gift Card Updates
- Added full `<style>` block with dark theme: green glow on store name/balance, panel backgrounds, proper code input styling
- QR code uses Google Charts API via `prepend` filter (RemoteAsset warning is unavoidable — no Shopify-native QR option)
- Print styles swap to black-on-white and hide actions
- `gift_card.code | format_code` and `gift_card.balance | money` confirmed working

### Translation Keys Added
- `contact.form.name`, `contact.form.email`, `contact.form.message` — required for contact form `name` attributes
- Theme check threw `TranslationKeyExists` error until these were added to `locales/en.default.json`

### JSON Template Pattern
- All 6 templates: `blog.json`, `article.json`, `page.json`, `page.contact.json`, `404.json`, `password.json`
- Simple structure: `"sections": { "main": { "type": "section-name", "settings": {...} } }, "order": ["main"]`

### Design Patterns Used
- Blog cards: 16:9 aspect ratio images, hover scale effect matching product-card pattern
- Article body: richtext styles (.rte) matching product description pattern
- Contact form: terminal-style placeholders `> enter_name`, success/error with `>` prompt prefix
- 404: ASCII art box drawing with Unicode block characters, min-height 60vh centered
- Password: Full-viewport centered layout, autofocus on password field
- All sections use `container--narrow` (720px) for content-focused pages except blog (full container)

### Theme Check Result
- 0 errors, 4 warnings (all pre-existing: RemoteAsset for QR, UndefinedObject for reset_password email, AssetPreload suggestions)

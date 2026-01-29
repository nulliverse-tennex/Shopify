# Matrix Terminal Theme V3 — Feature Upgrade

## TL;DR

> **Quick Summary**: Upgrade the Matrix Terminal Shopify theme with 15+ merchant-toggleable features: cart drawer, quick buy, gift wrapping, order notes, sticky header, back-to-top, recently viewed, recommended products, stock counter, quick view, promo popups, promo banners, countdown timer, and collection filtering. All features default OFF and conditionally load JS.
> 
> **Deliverables**:
> - Complete "Matrix Theme V3" folder (copy of V2 + all new features)
> - ~10 new JS files (conditionally loaded per feature)
> - ~10 new section/snippet files
> - Updated settings_schema.json with 5 new settings groups
> - Updated locales/en.default.json with new translation keys
> - All features toggleable, accessible, mobile-responsive
> 
> **Estimated Effort**: XL (20 tasks)
> **Parallel Execution**: YES — 6 waves
> **Critical Path**: Task 1 (Copy) → Task 2 (Foundation) → Task 3 (Cart Drawer) → Task 5 (Quick Buy) → Task 12 (Collection Filtering) → Task 20 (Integration QA)

---

## Context

### Original Request
Create a V3 version of the Matrix Shopify theme in a separate folder. Add selectable, implementable Shopify features: order notes, gift wrapping, quick buy, sticky cart, back-to-top, sticky header, recently viewed, recommended products, stock counter, quick view, promo popups, promo banners, countdown timer, and collection filtering.

### Interview Summary
**Key Discussions**:
- **Sticky cart**: Both drawer AND floating bubble — merchant chooses via settings
- **Quick buy**: Simple add-to-cart button on product cards; variant selector for multi-variant products
- **Gift wrapping**: Checkbox + flat fee in cart (merchant sets price in settings)
- **Stock counter**: Threshold-based — "Only X left!" below merchant threshold, hidden when high
- **Promo popup**: Both email capture AND announcement — merchant configurable
- **Countdown timer**: Global promo end date from theme settings, displayed in banner
- **Collection filtering**: Shopify native storefront filtering API (filter.v prefix)
- **JS architecture**: Separate file per feature, conditionally loaded when enabled
- **Feature toggles**: ALL features toggleable in theme settings, all default to OFF

**Research Findings**:
- Cart drawer: Web Component + Section Rendering API (~5-8KB)
- Quick buy: Lazy-load product form on click via Section Rendering API (~6KB)
- Recently viewed: localStorage array + fetch product HTML (~2KB)
- Recommendations: Native Shopify API `/recommendations/products.json` (~2KB)
- Filtering: `collection.filters` Liquid object + AJAX + `history.pushState` (~8KB)
- All marketing features: Liquid + lightweight JS, localStorage for dismissal

### Metis Review
**Identified Gaps (addressed)**:
- **Cart refactor risk**: CartManager needs event system before drawer. Build events FIRST, then drawer subscribes.
- **Quick buy N+1 forms**: Don't pre-render forms in product cards — lazy-load on interaction only.
- **Money format bug**: V2 hardcodes `$` in product.js. Fix with `{{ shop.money_format }}` injection.
- **Z-index conflicts**: 4 overlay features need explicit z-index assignments in CSS variables.
- **Settings bloat**: 15+ features need organized grouping (max 5 new groups).
- **Feature independence**: Each feature must work regardless of other features' state.
- **Overlay conflicts**: Need shared scroll-lock utility for drawer + popup + modal.
- **Features default OFF**: V3 with all features off must render identically to V2.

---

## Work Objectives

### Core Objective
Extend the Matrix Terminal theme with 15+ merchant-toggleable, production-quality Shopify features while maintaining the existing Matrix aesthetic, accessibility standards, and vanilla architecture.

### Concrete Deliverables
- `Matrix Theme V3/` directory with all V2 files plus new features
- New JS files: `cart-drawer.js`, `quick-buy.js`, `quick-view.js`, `recently-viewed.js`, `product-recommendations.js`, `countdown-timer.js`, `promo-popup.js`, `collection-filters.js`, `back-to-top.js`
- New sections: `cart-drawer.liquid`, `promo-banner.liquid`, `countdown-banner.liquid`, `product-recommendations.liquid`, `recently-viewed.liquid`, `collection-filters.liquid`
- New snippets: `quick-buy-button.liquid`, `stock-counter.liquid`, `promo-popup.liquid`, `back-to-top.liquid`
- Updated: `theme.liquid`, `theme.js`, `product.js`, `theme.css`, `settings_schema.json`, `settings_data.json`, `en.default.json`, `product-card.liquid`, `cart-template.liquid`, `product-template.liquid`, `collection-template.liquid`, `header.liquid`

### Definition of Done
- [ ] All 15+ features implemented and toggleable via theme settings
- [ ] All features default to OFF — V3 with all off renders identically to V2
- [ ] Each feature has its own JS file, conditionally loaded
- [ ] All overlays/modals have focus trap, Escape close, aria attributes
- [ ] `prefers-reduced-motion` respected in all new animations
- [ ] No `{% include %}` tags — only `{% render %}`
- [ ] All new JS files within per-file budget (see budgets below)
- [ ] `shopify theme check --fail-level error` → 0 errors (if CLI available)
- [ ] All locale keys exist in `en.default.json`
- [ ] Money formatting uses `shop.money_format` (not hardcoded `$`)

### Must Have
- All 15 features listed in user request
- Merchant toggle for every feature
- Conditional JS loading (only when enabled)
- Web Components pattern for all interactive JS
- Section Rendering API for dynamic updates
- Mobile-responsive behavior for all features
- WCAG 2.1 AA accessibility for all new UI
- Matrix aesthetic consistency (green-on-black, monospace, glow effects)

### Must NOT Have (Guardrails)
- **No build tools** — no npm, no bundlers, no PostCSS
- **No `{% include %}` tags** — only `{% render %}`
- **No external CDN dependencies** — all assets self-hosted
- **No pre-rendered forms in product cards** — lazy-load on quick buy interaction only
- **No modification of V2 visual output when all V3 features are OFF**
- **No checkout customization** — cart page/drawer is the boundary
- **Features must be independent** — each works regardless of other features' state
- **Per-file JS budgets**: cart-drawer.js ≤ 8KB, quick-buy.js ≤ 6KB, collection-filters.js ≤ 10KB, all others ≤ 5KB
- **No more than 5 new settings groups** in settings_schema.json

---

## Verification Strategy

### Test Decision
- **Infrastructure**: Shopify Theme Check + manual structural verification
- **User wants tests**: No (Liquid themes don't use unit test frameworks)
- **QA approach**: Automated file verification (grep, wc, test) + dev store manual testing

### Automated Verification (Agent-Executable)

**Per-feature verification pattern:**
```bash
# 1. File exists
test -f "Matrix Theme V3/assets/{feature}.js" && echo "PASS" || echo "FAIL"

# 2. Setting toggle exists in settings_schema
grep -c '"enable_{feature}"' "Matrix Theme V3/config/settings_schema.json"
# Assert: >= 1

# 3. Conditional loading in theme.liquid
grep -c 'enable_{feature}' "Matrix Theme V3/layout/theme.liquid"
# Assert: >= 1

# 4. File size within budget
wc -c < "Matrix Theme V3/assets/{feature}.js"
# Assert: <= budget

# 5. Web Component pattern
grep -c 'customElements.define' "Matrix Theme V3/assets/{feature}.js"
# Assert: >= 1

# 6. Accessibility markers
grep -c 'Escape\|aria-\|focus' "Matrix Theme V3/assets/{feature}.js"
# Assert: >= 2

# 7. Locale keys exist
grep -c '{feature}' "Matrix Theme V3/locales/en.default.json"
# Assert: >= 1
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Setup):
└── Task 1: Copy V2 → V3 directory

Wave 2 (After Wave 1 — Foundation):
└── Task 2: Foundation refactor (CartManager events, money format, z-index, settings groups)

Wave 3 (After Wave 2 — Cart Tier):
├── Task 3: Cart drawer (slide-out + floating bubble, merchant choice)
├── Task 4: Order notes + gift wrapping (cart enhancements)
└── Task 5: Quick buy (add-to-cart on product cards)

Wave 4 (After Wave 3 — Product + Navigation, parallel):
├── Task 6: Quick view modal (multi-variant quick buy opens this)
├── Task 7: Stock counter (threshold-based inventory display)
├── Task 8: Recommended products (Shopify Recommendations API)
├── Task 9: Recently viewed products (localStorage)
├── Task 10: Back-to-top button
├── Task 11: Sticky header toggle
└── Task 13: Promo banner (announcement bar section)

Wave 5 (After Wave 3 — Collection + Marketing, parallel with Wave 4):
├── Task 12: Collection filtering (Shopify native storefront filtering)
├── Task 14: Promo popup (email capture / announcement)
└── Task 15: Countdown timer banner

Wave 6 (After All — Integration):
└── Task 16: Integration QA + final verification
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | All | None |
| 2 | 1 | 3-16 | None |
| 3 | 2 | 4, 5, 6 | None |
| 4 | 3 | 16 | 5 |
| 5 | 3 | 6 | 4 |
| 6 | 5 | 16 | 7, 8, 9, 10, 11, 13 |
| 7 | 2 | 16 | 6, 8, 9, 10, 11, 13 |
| 8 | 2 | 16 | 6, 7, 9, 10, 11, 13 |
| 9 | 2 | 16 | 6, 7, 8, 10, 11, 13 |
| 10 | 2 | 16 | 6, 7, 8, 9, 11, 13 |
| 11 | 2 | 16 | 6, 7, 8, 9, 10, 13 |
| 12 | 2 | 16 | 14, 15 |
| 13 | 2 | 16 | 6-11, 14, 15 |
| 14 | 2 | 16 | 12, 13, 15 |
| 15 | 2 | 16 | 12, 13, 14 |
| 16 | All | None | None (final) |

---

## TODOs

---

- [x] 1. Copy V2 → V3 Directory

  **What to do**:
  - Copy `Matrix Theme v2/` directory to `Matrix Theme V3/`
  - Verify all files copied correctly
  - Update `settings_schema.json`: change theme version to `"3.0.0"` and theme name to `"Matrix Terminal V3"`
  - Update `settings_data.json`: rename preset to `"Matrix Terminal V3"`

  **Must NOT do**:
  - Do NOT modify any V2 section files' content yet
  - Do NOT delete or rename V2 directory

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (first task)
  - **Blocks**: All other tasks
  - **Blocked By**: None

  **References**:
  - Source: `/home/juanitolillig/Matrix Theme v2/` — complete V2 theme directory
  - `config/settings_schema.json` — update `theme_info` name and version
  - `config/settings_data.json` — rename preset key

  **Acceptance Criteria**:
  ```bash
  test -d "Matrix Theme V3" && echo "PASS" || echo "FAIL"
  diff <(ls -R "Matrix Theme v2/" | wc -l) <(ls -R "Matrix Theme V3/" | wc -l)
  # Assert: Same count
  grep -c '"3.0.0"' "Matrix Theme V3/config/settings_schema.json"
  # Assert: >= 1
  grep -c '"Matrix Terminal V3"' "Matrix Theme V3/config/settings_data.json"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): copy V2 theme as V3 base`
  - Files: `Matrix Theme V3/`

---

- [x] 2. Foundation Refactor — Cart Events, Money Format, Z-Index, Settings

  **What to do**:
  - **Cart event system**: Refactor `theme.js` CartManager to emit Custom Events after every cart operation:
    - `document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }))` after `/cart/change.js`
    - `document.dispatchEvent(new CustomEvent('cart:item-added', { detail: { items } }))` — new event for add-to-cart
    - Keep existing cart page rendering as-is (backward compatible)
  - **Money format fix**: In `layout/theme.liquid`, add `<script>window.Shopify = window.Shopify || {}; window.Shopify.moneyFormat = {{ shop.money_format | json }};</script>` before other scripts. Create a shared `formatMoney(cents)` function in `theme.js` that uses this format string. Update `product.js` to use `formatMoney()` instead of hardcoded `'$'`.
  - **Z-index additions**: Add to `:root` in `theme.css`:
    - `--z-back-to-top: 50`
    - `--z-sticky-cart: 300`
    - `--z-cart-drawer: 900`
    - `--z-quick-view: 800`
    - `--z-popup: 950`
  - **Shared scroll-lock utility**: Add `lockScroll()` and `unlockScroll()` functions to `theme.js` that track lock count (multiple overlays can lock, only unlock when all release).
  - **Settings schema**: Add 5 new groups to `settings_schema.json`:
    - "Cart Features": enable_cart_drawer (checkbox), cart_type (select: drawer/bubble), enable_order_notes (checkbox), enable_gift_wrapping (checkbox), gift_wrap_fee (text, default "$5.00")
    - "Navigation": enable_sticky_header (checkbox), enable_back_to_top (checkbox)
    - "Product Highlights": enable_stock_counter (checkbox), stock_threshold (range 1-50, default 10), enable_recommended_products (checkbox), enable_recently_viewed (checkbox)
    - "Marketing & Promotions": enable_promo_banner (checkbox), enable_promo_popup (checkbox), popup_type (select: email/announcement), popup_delay (range 1-30 seconds, default 5), popup_heading (text), popup_text (textarea), popup_button_text (text)
    - "Countdown Timer": enable_countdown (checkbox), countdown_end_date (text, ISO format), countdown_label (text), countdown_expired_message (text)
  - **Settings data**: Add all new settings to `settings_data.json` current + preset, ALL defaulting to `false`/empty.
  - **Locale keys**: Add all new feature keys to `en.default.json`:
    - `cart.drawer_title`, `cart.order_note_label`, `cart.gift_wrap_label`, `cart.gift_wrap_fee`
    - `product.stock_low`, `product.stock_in_stock`, `product.stock_out`, `product.quick_buy`, `product.quick_view`, `product.recommended_title`, `product.recently_viewed_title`
    - `collection.filter_title`, `collection.clear_filters`, `collection.no_results_filtered`
    - `promo.popup_close`, `promo.banner_close`, `promo.subscribe`, `promo.email_placeholder`
    - `countdown.days`, `countdown.hours`, `countdown.minutes`, `countdown.seconds`, `countdown.expired`
    - `navigation.back_to_top`, `navigation.scroll_to_top`

  **Must NOT do**:
  - Do NOT change existing CartManager page-rendering behavior — only ADD event emissions
  - Do NOT change any section visual output — only add infrastructure
  - Do NOT create new feature files yet — only foundation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: JS architecture, CSS custom properties, Shopify settings patterns

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Task 1)
  - **Blocks**: Tasks 3-16
  - **Blocked By**: Task 1

  **References**:
  - `Matrix Theme V3/assets/theme.js:97` — Current CartManager class starts here (refactor target)
  - `Matrix Theme V3/assets/product.js:111-113` — Hardcoded `$` in `formatMoney()` function (fix target: `return '$' + (cents / 100).toFixed(2)`)
  - `Matrix Theme V3/assets/theme.css` — Current `:root` CSS variables (add z-index)
  - `Matrix Theme V3/assets/theme.js:10-88` — MobileMenu Web Component (reference for focus trap, scroll lock patterns)
  - `Matrix Theme V3/assets/product.js:206` — `window.location.href = '/cart'` redirect (intercept for cart drawer)
  - `Matrix Theme V3/config/settings_schema.json` — Current 4 groups (add 5 new groups)
  - `Matrix Theme V3/layout/theme.liquid` — Add money format injection
  - Dawn `config/settings_schema.json` — Reference for settings group patterns
  - Shopify settings schema docs: `https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema`

  **Acceptance Criteria**:
  ```bash
  # Cart events emitted
  grep -c "cart:updated\|cart:item-added" "Matrix Theme V3/assets/theme.js"
  # Assert: >= 2

  # Money format injection
  grep -c "moneyFormat" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 1

  # formatMoney function exists
  grep -c "formatMoney" "Matrix Theme V3/assets/theme.js"
  # Assert: >= 1

  # product.js uses formatMoney (no hardcoded $)
  grep -c 'formatMoney' "Matrix Theme V3/assets/product.js"
  # Assert: >= 1
  grep -c "'\\\$'" "Matrix Theme V3/assets/product.js"
  # Assert: 0

  # Z-index additions
  grep -c "z-cart-drawer\|z-quick-view\|z-popup\|z-back-to-top\|z-sticky-cart" "Matrix Theme V3/assets/theme.css"
  # Assert: >= 5

  # Scroll lock utility
  grep -c "lockScroll\|unlockScroll" "Matrix Theme V3/assets/theme.js"
  # Assert: >= 2

  # New settings groups
  grep -c "Cart Features\|Navigation\|Product Highlights\|Marketing\|Countdown" "Matrix Theme V3/config/settings_schema.json"
  # Assert: >= 5

  # All new settings default to false
  grep -c '"enable_cart_drawer"\|"enable_order_notes"\|"enable_gift_wrapping"\|"enable_stock_counter"\|"enable_recommended"\|"enable_recently_viewed"\|"enable_promo_banner"\|"enable_promo_popup"\|"enable_countdown"\|"enable_sticky_header"\|"enable_back_to_top"' "Matrix Theme V3/config/settings_schema.json"
  # Assert: >= 11

  # Locale keys added
  grep -c "drawer_title\|order_note\|gift_wrap\|stock_low\|quick_buy\|quick_view\|recommended_title\|recently_viewed\|filter_title\|popup_close\|back_to_top\|countdown" "Matrix Theme V3/locales/en.default.json"
  # Assert: >= 10
  ```

  **Commit**: YES
  - Message: `feat(v3): add foundation — cart events, money format, z-index, settings groups`
  - Files: `theme.js`, `product.js`, `theme.css`, `theme.liquid`, `settings_schema.json`, `settings_data.json`, `en.default.json`

---

- [x] 3. Cart Drawer — Slide-out Drawer + Floating Bubble

  **What to do**:
  - Create `sections/cart-drawer.liquid`:
    - Slide-out drawer panel from right (320px wide, full height)
    - Cart title, line items (image, title, variant, price, qty controls, remove)
    - Subtotal, checkout button
    - Close button `[X]`, overlay backdrop
    - Empty cart state
    - Section schema with no settings (controlled by global settings)
  - Create `assets/cart-drawer.js`:
    - Web Component `<cart-drawer>` extends HTMLElement
    - Methods: `open()`, `close()`, `refresh()` (via Section Rendering API `/?sections=cart-drawer`)
    - Listens for `cart:item-added` and `cart:updated` events
    - Focus trap, Escape key close, aria-expanded
    - Uses `lockScroll()` / `unlockScroll()` from theme.js
    - If `cart_type == 'bubble'`: render as floating button (bottom-right, shows item count) that opens the same drawer
    - If `cart_type == 'drawer'`: no floating button, drawer opens via header cart click + add-to-cart events
  - Create `snippets/cart-drawer-item.liquid`:
    - Reusable cart line item for drawer (compact version of cart-template line items)
  - Update `layout/theme.liquid`:
    - Add `{% if settings.enable_cart_drawer %}{% section 'cart-drawer' %}{% endif %}` before `</body>`
    - Conditionally load `cart-drawer.js` when enabled
  - Update `assets/product.js`:
    - After successful add-to-cart: if `settings.enable_cart_drawer` → dispatch `cart:item-added` event (drawer opens); else → redirect to `/cart` (V2 behavior)
    - Pass enable_cart_drawer setting via data attribute on `<product-form>`: `data-cart-drawer="{{ settings.enable_cart_drawer }}"`
  - Update `sections/header.liquid`:
    - When cart drawer enabled: cart link click opens drawer instead of navigating to /cart
    - Add `data-cart-drawer-open` attribute to cart link when drawer enabled

  **Must NOT do**:
  - Do NOT remove the /cart page — it remains as fallback
  - Do NOT pre-load cart data on page load — fetch only when drawer opens
  - Do NOT exceed 8KB for cart-drawer.js

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Drawer UX, overlay patterns, cart interaction design

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (first in cart tier)
  - **Blocks**: Tasks 4, 5, 6
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/assets/theme.js` — CartManager class with new event system (from Task 2)
  - `Matrix Theme V3/sections/cart-template.liquid` — Existing cart page layout (reference for drawer line items)
  - `Matrix Theme V3/assets/theme.js:10-88` — MobileMenu Web Component (reference pattern for drawer + focus trap + scroll lock)
  - Dawn `snippets/cart-drawer.liquid` — Reference for drawer markup and Section Rendering API usage
  - Dawn `assets/cart-drawer.js` — Reference for drawer Web Component pattern
  - Cart API: `https://shopify.dev/docs/api/ajax/reference/cart`
  - Section Rendering API: `https://shopify.dev/docs/api/section-rendering`

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/sections/cart-drawer.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/cart-drawer.js" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/snippets/cart-drawer-item.liquid" && echo "PASS" || echo "FAIL"

  wc -c < "Matrix Theme V3/assets/cart-drawer.js"
  # Assert: <= 8192

  grep -c "customElements.define" "Matrix Theme V3/assets/cart-drawer.js"
  # Assert: >= 1

  grep -c "cart:item-added\|cart:updated" "Matrix Theme V3/assets/cart-drawer.js"
  # Assert: >= 2

  grep -c "Escape\|aria-\|focus" "Matrix Theme V3/assets/cart-drawer.js"
  # Assert: >= 3

  grep -c "lockScroll\|unlockScroll" "Matrix Theme V3/assets/cart-drawer.js"
  # Assert: >= 2

  grep -c "enable_cart_drawer" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 1

  grep -c "cart:item-added" "Matrix Theme V3/assets/product.js"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add cart drawer with slide-out and floating bubble options`
  - Files: `sections/cart-drawer.liquid`, `assets/cart-drawer.js`, `snippets/cart-drawer-item.liquid`, `layout/theme.liquid`, `assets/product.js`, `sections/header.liquid`

---

- [ ] 4. Order Notes + Gift Wrapping

  **What to do**:
  - **Order Notes**: Update `sections/cart-template.liquid` and `sections/cart-drawer.liquid`:
    - Add `{% if settings.enable_order_notes %}<textarea name="note" form="cart" placeholder="{{ 'cart.order_note_placeholder' | t }}">{{ cart.note }}</textarea>{% endif %}`
    - Style with existing `.form-textarea` class + Matrix aesthetic
  - **Gift Wrapping**: Update both cart sections:
    - Add `{% if settings.enable_gift_wrapping %}` block with checkbox
    - `<input type="checkbox" name="attributes[gift_wrapping]" value="Yes" form="cart">`
    - Display fee text: `{{ 'cart.gift_wrap_fee' | t }}: {{ settings.gift_wrap_fee }}`
    - Gift wrapping uses cart attributes (order-level, not per-item)
    - Optional: gift message textarea `name="attributes[gift_message]"`
  - Update locale keys if any were missed in Task 2

  **Must NOT do**:
  - Do NOT create a separate product for gift wrap fee (too complex for theme-only solution)
  - Do NOT add per-item gift wrapping (order-level only)
  - Gift wrapping fee is display-only — actual charging requires Shopify Scripts or manual order adjustment

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 5)
  - **Blocks**: Task 16
  - **Blocked By**: Task 3

  **References**:
  - `Matrix Theme V3/sections/cart-template.liquid` — Existing cart page (add notes + gift wrap)
  - `Matrix Theme V3/sections/cart-drawer.liquid` — New cart drawer (add notes + gift wrap, from Task 3)
  - Shopify cart attributes: `https://shopify.dev/docs/api/liquid/objects/cart#cart-attributes`
  - Shopify cart note: `https://shopify.dev/docs/api/liquid/objects/cart#cart-note`

  **Acceptance Criteria**:
  ```bash
  grep -c 'enable_order_notes' "Matrix Theme V3/sections/cart-template.liquid"
  # Assert: >= 1
  grep -c 'enable_gift_wrapping' "Matrix Theme V3/sections/cart-template.liquid"
  # Assert: >= 1
  grep -c 'name="note"' "Matrix Theme V3/sections/cart-template.liquid"
  # Assert: >= 1
  grep -c 'attributes\[gift_wrapping\]' "Matrix Theme V3/sections/cart-template.liquid"
  # Assert: >= 1
  grep -c 'enable_order_notes' "Matrix Theme V3/sections/cart-drawer.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add order notes and gift wrapping to cart`
  - Files: `sections/cart-template.liquid`, `sections/cart-drawer.liquid`

---

- [ ] 5. Quick Buy — Add to Cart from Collection Pages

  **What to do**:
  - Create `snippets/quick-buy-button.liquid`:
    - For single-variant products: simple "Add to Cart" button with `data-variant-id="{{ product.first_available_variant.id }}"`
    - For multi-variant products: "Quick Add" button with `data-product-url="{{ product.url }}"`
    - Sold-out products: disabled button
    - Wrapped in `<quick-buy-button>` custom element
  - Create `assets/quick-buy.js`:
    - Web Component `<quick-buy-button>` extends HTMLElement
    - Single variant: POST to `/cart/add.js` directly, dispatch `cart:item-added`
    - Multi variant: fetch product section via Section Rendering API, show in quick view modal (Task 6), OR show inline variant picker
    - Loading state on button during fetch
    - Error handling with inline message
  - Update `snippets/product-card.liquid`:
    - Add `{% if settings.enable_quick_buy %}{% render 'quick-buy-button', product: product %}{% endif %}` below price
  - Update `layout/theme.liquid`:
    - Conditionally load `quick-buy.js`

  **Must NOT do**:
  - Do NOT pre-render full product forms in cards — lazy-load on click only
  - Do NOT exceed 6KB for quick-buy.js
  - Do NOT add variant swatches to cards

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 3

  **References**:
  - `Matrix Theme V3/snippets/product-card.liquid` — Existing product card (add button)
  - `Matrix Theme V3/assets/product.js` — ProductForm Web Component (reference for cart add pattern)
  - Dawn `assets/quick-add.js` — Reference for quick add Web Component
  - Dawn `snippets/card-product.liquid` — Reference for quick add button placement

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/quick-buy-button.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/quick-buy.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/quick-buy.js"
  # Assert: <= 6144
  grep -c "customElements.define" "Matrix Theme V3/assets/quick-buy.js"
  # Assert: >= 1
  grep -c "cart:item-added" "Matrix Theme V3/assets/quick-buy.js"
  # Assert: >= 1
  grep -c "enable_quick_buy" "Matrix Theme V3/snippets/product-card.liquid"
  # Assert: >= 1
  grep -c "quick-buy" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add quick buy button to product cards`
  - Files: `snippets/quick-buy-button.liquid`, `assets/quick-buy.js`, `snippets/product-card.liquid`, `layout/theme.liquid`

---

- [ ] 6. Quick View Modal

  **What to do**:
  - Create `snippets/quick-view-modal.liquid`:
    - Modal overlay with product details (image, title, price, variant selector, add-to-cart, description excerpt)
    - "View Full Details" link to product page
    - Close button, overlay backdrop click-to-close
  - Create `assets/quick-view.js`:
    - Web Component `<quick-view-modal>` extends HTMLElement
    - Fetches product section via Section Rendering API: `fetch(productUrl + '?section_id=product-template')`
    - Extracts and injects product form HTML
    - Focus trap, Escape close, aria-modal="true"
    - Uses `lockScroll()` / `unlockScroll()`
    - Z-index: `var(--z-quick-view)`
  - Update `assets/quick-buy.js` (from Task 5):
    - Multi-variant products: open quick view modal instead of inline picker
  - Update `layout/theme.liquid`:
    - Add modal container + conditionally load `quick-view.js`

  **Must NOT do**:
  - Do NOT duplicate product.js logic — reuse via Section Rendering API
  - Do NOT exceed 5KB for quick-view.js

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 7-11, 13)
  - **Blocks**: Task 16
  - **Blocked By**: Task 5

  **References**:
  - `Matrix Theme V3/assets/quick-buy.js` — Quick buy triggers modal for multi-variant (from Task 5)
  - `Matrix Theme V3/sections/product-template.liquid` — Product section to fetch via Section Rendering API
  - `Matrix Theme V3/assets/theme.js` — lockScroll/unlockScroll utilities (from Task 2)
  - Dawn `assets/quick-add.js` — Reference for modal + Section Rendering API fetch

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/quick-view-modal.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/quick-view.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/quick-view.js"
  # Assert: <= 5120
  grep -c "customElements.define" "Matrix Theme V3/assets/quick-view.js"
  # Assert: >= 1
  grep -c "section_id\|section-rendering\|sections=" "Matrix Theme V3/assets/quick-view.js"
  # Assert: >= 1
  grep -c "Escape\|aria-\|focus" "Matrix Theme V3/assets/quick-view.js"
  # Assert: >= 3
  ```

  **Commit**: YES
  - Message: `feat(v3): add quick view modal for multi-variant products`
  - Files: `snippets/quick-view-modal.liquid`, `assets/quick-view.js`, `layout/theme.liquid`

---

- [ ] 7. Stock Counter

  **What to do**:
  - Create `snippets/stock-counter.liquid`:
    - Checks `variant.inventory_management == 'shopify'` and `variant.inventory_quantity`
    - Below threshold: `> WARNING: Only {{ inventory }} left in stock_` (terminal style, with glow)
    - Above threshold: hidden (no output)
    - Out of stock: `> ERROR: OUT OF STOCK_`
    - Uses `settings.stock_threshold` for cutoff
  - Update `sections/product-template.liquid`:
    - Add `{% if settings.enable_stock_counter %}{% render 'stock-counter', variant: current_variant %}{% endif %}` near price
  - Update `assets/product.js`:
    - On variant change, update stock counter display using variant's `inventory_quantity`
    - Pass variant inventory data via product JSON (already embedded in section)

  **Must NOT do**:
  - Do NOT show exact count above threshold — only urgency messaging below threshold
  - Do NOT create a separate JS file — this is lightweight enough to handle in product.js

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/sections/product-template.liquid` — Product page (add stock counter)
  - `Matrix Theme V3/assets/product.js` — Variant change handler (update stock display)
  - Shopify inventory_quantity: `https://shopify.dev/docs/api/liquid/objects/variant#variant-inventory_quantity`

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/stock-counter.liquid" && echo "PASS" || echo "FAIL"
  grep -c "inventory_quantity\|inventory_management" "Matrix Theme V3/snippets/stock-counter.liquid"
  # Assert: >= 2
  grep -c "stock_threshold" "Matrix Theme V3/snippets/stock-counter.liquid"
  # Assert: >= 1
  grep -c "enable_stock_counter" "Matrix Theme V3/sections/product-template.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add threshold-based stock counter to product page`
  - Files: `snippets/stock-counter.liquid`, `sections/product-template.liquid`, `assets/product.js`

---

- [ ] 8. Recommended Products (Shopify Recommendations API)

  **What to do**:
  - Create `sections/product-recommendations.liquid`:
    - Container with heading: `> RECOMMENDED_PRODUCTS_`
    - Grid of product cards (reuse `{% render 'product-card' %}`)
    - Schema: title text, max products (4/6/8)
  - Create `assets/product-recommendations.js`:
    - Web Component `<product-recommendations>` extends HTMLElement
    - Fetches `/recommendations/products?product_id={{ product.id }}&section_id=product-recommendations&limit=4&intent=related`
    - Replaces section content with response HTML
    - Handles empty response (hides section)
  - Update `templates/product.json`:
    - Add recommendations section after main product section (conditionally via settings)
  - Update `layout/theme.liquid`:
    - Conditionally load `product-recommendations.js`

  **Must NOT do**:
  - Do NOT exceed 5KB for product-recommendations.js
  - Do NOT show section if API returns empty array

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - Shopify Recommendations API: `https://shopify.dev/docs/api/ajax/reference/product-recommendations`
  - `Matrix Theme V3/snippets/product-card.liquid` — Reuse for recommendation cards
  - Dawn `sections/product-recommendations.liquid` — Reference implementation

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/sections/product-recommendations.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/product-recommendations.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/product-recommendations.js"
  # Assert: <= 5120
  grep -c "recommendations/products" "Matrix Theme V3/assets/product-recommendations.js"
  # Assert: >= 1
  grep -c "product-card" "Matrix Theme V3/sections/product-recommendations.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add recommended products section via Shopify API`
  - Files: `sections/product-recommendations.liquid`, `assets/product-recommendations.js`, `templates/product.json`, `layout/theme.liquid`

---

- [ ] 9. Recently Viewed Products

  **What to do**:
  - Create `sections/recently-viewed.liquid`:
    - Container with heading: `> RECENTLY_VIEWED_`
    - Empty `<div id="recently-viewed-grid" class="grid grid--4">` (populated by JS)
    - Section hides entirely when no recently viewed products
  - Create `assets/recently-viewed.js`:
    - Web Component `<recently-viewed>` extends HTMLElement
    - On product pages: save product handle + timestamp to localStorage (max 20 items, FIFO)
    - On any page with the section: read localStorage, exclude current product
    - Fetch each product's card via `/products/{handle}?section_id=product-card-ajax` (or use alternate template `?view=card`)
    - Render cards into grid
    - If empty localStorage: hide section entirely
  - Create `snippets/product-card-ajax.liquid` (or use alternate template):
    - Lightweight product card renderable via Section Rendering API
    - Same markup as `product-card.liquid` but standalone
  - Update `templates/product.json` (and optionally `index.json`, `collection.json`):
    - Add recently-viewed section
  - Update `layout/theme.liquid`:
    - Conditionally load `recently-viewed.js`

  **Must NOT do**:
  - Do NOT exceed 5KB for recently-viewed.js
  - Do NOT fetch more than 6 products at a time
  - Do NOT store sensitive data in localStorage

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/snippets/product-card.liquid` — Card markup to replicate
  - localStorage API: `https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage`

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/sections/recently-viewed.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/recently-viewed.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/recently-viewed.js"
  # Assert: <= 5120
  grep -c "localStorage" "Matrix Theme V3/assets/recently-viewed.js"
  # Assert: >= 2
  grep -c "customElements.define" "Matrix Theme V3/assets/recently-viewed.js"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add recently viewed products via localStorage`
  - Files: `sections/recently-viewed.liquid`, `assets/recently-viewed.js`, `layout/theme.liquid`

---

- [ ] 10. Back-to-Top Button

  **What to do**:
  - Create `snippets/back-to-top.liquid`:
    - Fixed button bottom-right: `> TOP ↑` (terminal style)
    - Hidden by default, visible after scrolling 300px
    - Z-index: `var(--z-back-to-top)`
    - `aria-label="{{ 'navigation.scroll_to_top' | t }}"`
    - Inline `<style>` for positioning and animation
    - Inline `<script>` (small enough, ~20 lines): scroll listener + smooth scroll
    - Respects `prefers-reduced-motion` (instant scroll instead of smooth)
  - Update `layout/theme.liquid`:
    - Add `{% if settings.enable_back_to_top %}{% render 'back-to-top' %}{% endif %}` before `</body>`

  **Must NOT do**:
  - Do NOT create a separate JS file — this is <1KB inline
  - Do NOT overlap with cart drawer floating bubble (position adjusts if both enabled)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/assets/theme.css` — `.btn` class, `--z-back-to-top` variable (from Task 2)

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/back-to-top.liquid" && echo "PASS" || echo "FAIL"
  grep -c "scroll_to_top\|scrollTo\|back-to-top" "Matrix Theme V3/snippets/back-to-top.liquid"
  # Assert: >= 2
  grep -c "enable_back_to_top" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 1
  grep -c "prefers-reduced-motion" "Matrix Theme V3/snippets/back-to-top.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add back-to-top button`
  - Files: `snippets/back-to-top.liquid`, `layout/theme.liquid`

---

- [ ] 11. Sticky Header Toggle

  **What to do**:
  - Update `sections/header.liquid`:
    - Header is already sticky in V2 (CSS `position: sticky`)
    - Add conditional: `{% if settings.enable_sticky_header %}` wraps the sticky CSS
    - When disabled: `position: relative` (scrolls away normally)
    - Add hide-on-scroll-down behavior (optional enhancement):
      - Small inline `<script>` (~15 lines) with Intersection Observer
      - Header hides when scrolling down, shows when scrolling up
      - Class toggle: `.header--hidden { transform: translateY(-100%); transition: transform 0.3s; }`

  **Must NOT do**:
  - Do NOT create a separate JS file — inline script in header section
  - Do NOT break existing header layout

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/sections/header.liquid:107-109` — Current sticky CSS
  - Intersection Observer API: `https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API`

  **Acceptance Criteria**:
  ```bash
  grep -c "enable_sticky_header" "Matrix Theme V3/sections/header.liquid"
  # Assert: >= 1
  grep -c "IntersectionObserver\|header--hidden" "Matrix Theme V3/sections/header.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add toggleable sticky header with hide-on-scroll`
  - Files: `sections/header.liquid`

---

- [ ] 12. Collection Filtering (Shopify Native Storefront Filtering)

  **What to do**:
  - Create `snippets/collection-filters.liquid`:
    - Sidebar/top-bar filter UI using `{% for filter in collection.filters %}`
    - Filter types: `list` (checkboxes), `price_range` (min/max inputs)
    - Active filters display with remove buttons
    - "Clear all" button
    - Responsive: sidebar on desktop, drawer/collapsible on mobile
  - Create `assets/collection-filters.js`:
    - Web Component `<collection-filters>` extends HTMLElement
    - AJAX form submission: intercept form submit, build URL params, fetch filtered page
    - Parse response HTML, replace product grid + pagination + filter counts
    - `history.pushState` for URL update without reload
    - Handles empty results (show filtered empty state with "Clear filters" link)
    - Debounced price range inputs
  - Update `sections/collection-template.liquid`:
    - Wrap in flex layout: sidebar (filters) + main (grid)
    - Add `{% if settings.enable_collection_filtering %}{% render 'collection-filters' %}{% endif %}`
    - Add wrapper divs with IDs for JS section replacement
  - Add sorting dropdown to collection:
    - `<select name="sort_by">` with options from `collection.sort_options`
    - AJAX sort (uses same fetch pattern as filters)
  - Update `layout/theme.liquid`:
    - Conditionally load `collection-filters.js`

  **Must NOT do**:
  - Do NOT exceed 10KB for collection-filters.js
  - Do NOT implement custom filtering — use Shopify's native `collection.filters` only
  - Do NOT add predictive/AJAX search (separate feature, not requested)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Filter UI, sidebar layout, responsive drawer, form interaction

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 14, 15)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - Shopify Storefront Filtering: `https://shopify.dev/docs/storefronts/themes/navigation-search/filtering`
  - `collection.filters` Liquid object: `https://shopify.dev/docs/api/liquid/objects/collection#collection-filters`
  - `collection.sort_options`: `https://shopify.dev/docs/api/liquid/objects/collection#collection-sort_options`
  - Dawn `assets/facets.js` — Reference for AJAX filtering + history.pushState
  - `Matrix Theme V3/sections/collection-template.liquid` — Current collection page layout

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/collection-filters.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/collection-filters.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/collection-filters.js"
  # Assert: <= 10240
  grep -c "collection.filters\|filter.label\|filter.values" "Matrix Theme V3/snippets/collection-filters.liquid"
  # Assert: >= 3
  grep -c "history.pushState\|replaceState" "Matrix Theme V3/assets/collection-filters.js"
  # Assert: >= 1
  grep -c "customElements.define" "Matrix Theme V3/assets/collection-filters.js"
  # Assert: >= 1
  grep -c "enable_collection_filtering" "Matrix Theme V3/sections/collection-template.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add native Shopify collection filtering and sorting`
  - Files: `snippets/collection-filters.liquid`, `assets/collection-filters.js`, `sections/collection-template.liquid`, `layout/theme.liquid`

---

- [ ] 13. Promo Banner (Announcement Bar)

  **What to do**:
  - Create `sections/promo-banner.liquid`:
    - Full-width bar above header: terminal-style announcement
    - Text content from settings: `> {{ section.settings.text }}_`
    - Optional link
    - Dismissible (close button, localStorage remembers for session)
    - Green accent background with dark text, or dark background with green text (merchant choice)
    - Schema: text, link, link_text, show_close_button, color_scheme
  - Update `sections/header-group.json`:
    - Add promo-banner section BEFORE header in section group
    - Conditional: only renders if `settings.enable_promo_banner`

  **Must NOT do**:
  - Do NOT create a separate JS file — dismiss logic is <20 lines inline
  - Do NOT add rotating multiple announcements (keep simple)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 6-11)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - Dawn `sections/announcement-bar.liquid` — Reference for announcement bar pattern
  - `Matrix Theme V3/sections/header-group.json` — Section group to add banner to

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/sections/promo-banner.liquid" && echo "PASS" || echo "FAIL"
  grep -c "{% schema %}" "Matrix Theme V3/sections/promo-banner.liquid"
  # Assert: 1
  grep -c "localStorage" "Matrix Theme V3/sections/promo-banner.liquid"
  # Assert: >= 1
  grep -c "promo-banner" "Matrix Theme V3/sections/header-group.json"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add dismissible promo banner above header`
  - Files: `sections/promo-banner.liquid`, `sections/header-group.json`

---

- [ ] 14. Promo Popup (Email Capture / Announcement)

  **What to do**:
  - Create `snippets/promo-popup.liquid`:
    - Modal overlay popup
    - Configurable as email capture (`{% form 'customer' %}` with accepts_marketing) OR announcement (text only)
    - Heading, body text, optional email form, CTA button
    - Close button, overlay click-to-close
    - Terminal-style design: dark panel, green border, glow
  - Create `assets/promo-popup.js`:
    - Web Component `<promo-popup>` extends HTMLElement
    - Trigger: shows after `settings.popup_delay` seconds (default 5)
    - localStorage: remembers dismissal for 7 days (`promo-popup-dismissed` + timestamp)
    - Does NOT show on password page
    - Focus trap, Escape close, aria-modal
    - Uses `lockScroll()` / `unlockScroll()`
    - Z-index: `var(--z-popup)`
  - Update `layout/theme.liquid`:
    - Add `{% if settings.enable_promo_popup %}{% render 'promo-popup' %}{% endif %}` before `</body>`
    - Conditionally load `promo-popup.js`

  **Must NOT do**:
  - Do NOT exceed 5KB for promo-popup.js
  - Do NOT show popup on password page
  - Do NOT show popup if already dismissed within 7 days

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 12, 15)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/assets/theme.js` — lockScroll/unlockScroll utilities
  - Shopify customer form: `https://shopify.dev/docs/api/liquid/tags/form#customer`
  - `Matrix Theme V3/assets/theme.js:10-88` — MobileMenu pattern (focus trap reference)

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/snippets/promo-popup.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/promo-popup.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/promo-popup.js"
  # Assert: <= 5120
  grep -c "customElements.define" "Matrix Theme V3/assets/promo-popup.js"
  # Assert: >= 1
  grep -c "localStorage" "Matrix Theme V3/assets/promo-popup.js"
  # Assert: >= 1
  grep -c "Escape\|aria-\|focus" "Matrix Theme V3/assets/promo-popup.js"
  # Assert: >= 3
  grep -c "enable_promo_popup" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add promo popup with email capture and announcement modes`
  - Files: `snippets/promo-popup.liquid`, `assets/promo-popup.js`, `layout/theme.liquid`

---

- [ ] 15. Countdown Timer Banner

  **What to do**:
  - Create `sections/countdown-banner.liquid`:
    - Banner section with countdown display
    - Terminal-style: `> SALE ENDS IN: 02d 14h 32m 08s_`
    - Four digit groups: days, hours, minutes, seconds with labels from locale
    - When expired: shows `settings.countdown_expired_message` or hides entirely
    - Schema: inherits from global settings (end_date, label, expired_message)
  - Create `assets/countdown-timer.js`:
    - Web Component `<countdown-timer>` extends HTMLElement
    - Reads end date from `data-end-date` attribute
    - Updates every second via `setInterval`
    - On expiry: dispatches `countdown:expired` event, updates display
    - Respects `prefers-reduced-motion` (still counts down, just no flip animation)
  - Update `sections/header-group.json`:
    - Add countdown-banner section (can coexist with promo-banner)
  - Update `layout/theme.liquid`:
    - Conditionally load `countdown-timer.js`

  **Must NOT do**:
  - Do NOT exceed 5KB for countdown-timer.js
  - Do NOT use fake/resetting timers — real UTC dates only
  - Do NOT add per-product timers (global only per requirements)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 12, 14)
  - **Blocks**: Task 16
  - **Blocked By**: Task 2

  **References**:
  - `Matrix Theme V3/sections/header-group.json` — Section group for banners
  - `Matrix Theme V3/assets/theme.css` — Design system variables for consistent styling

  **Acceptance Criteria**:
  ```bash
  test -f "Matrix Theme V3/sections/countdown-banner.liquid" && echo "PASS" || echo "FAIL"
  test -f "Matrix Theme V3/assets/countdown-timer.js" && echo "PASS" || echo "FAIL"
  wc -c < "Matrix Theme V3/assets/countdown-timer.js"
  # Assert: <= 5120
  grep -c "customElements.define" "Matrix Theme V3/assets/countdown-timer.js"
  # Assert: >= 1
  grep -c "setInterval\|requestAnimationFrame" "Matrix Theme V3/assets/countdown-timer.js"
  # Assert: >= 1
  grep -c "countdown" "Matrix Theme V3/sections/header-group.json"
  # Assert: >= 1
  ```

  **Commit**: YES
  - Message: `feat(v3): add countdown timer banner for promotions`
  - Files: `sections/countdown-banner.liquid`, `assets/countdown-timer.js`, `sections/header-group.json`, `layout/theme.liquid`

---

- [ ] 16. Integration QA + Final Verification

  **What to do**:
  - **V2 backward compatibility**: Verify that with ALL V3 features toggled OFF in settings_data.json, the theme renders the same files/structure as V2
  - **Feature independence**: Verify each feature's toggle setting exists and JS is conditionally loaded
  - **File structure audit**: Count all new files, verify all exist
  - **JS budget audit**: Check every new JS file is within budget
  - **Settings audit**: Verify all settings have defaults, all groups organized
  - **Locale audit**: Verify all new translation keys exist
  - **Accessibility audit**: Grep all new JS files for focus/aria/Escape patterns
  - **Code quality**: No `{% include %}`, no hardcoded `$`, no external CDN refs
  - **Theme check**: Run `shopify theme check --fail-level error` if available
  - **Update settings_data.json**: Ensure all new settings are in both `current` and preset

  **Must NOT do**:
  - Do NOT modify feature implementations — only verify and document issues

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential — must run LAST)
  - **Blocks**: None (final task)
  - **Blocked By**: All previous tasks (1-15)

  **References**:
  - All files in `Matrix Theme V3/`
  - `Matrix Theme v2/` for backward compatibility comparison

  **Acceptance Criteria**:
  ```bash
  # === FILE STRUCTURE ===
  # New JS files exist
  for f in cart-drawer quick-buy quick-view product-recommendations recently-viewed countdown-timer promo-popup collection-filters; do
    test -f "Matrix Theme V3/assets/$f.js" && echo "PASS: $f.js" || echo "FAIL: $f.js"
  done

  # New section/snippet files exist
  for f in cart-drawer promo-banner countdown-banner product-recommendations recently-viewed; do
    test -f "Matrix Theme V3/sections/$f.liquid" && echo "PASS: sections/$f" || echo "FAIL: sections/$f"
  done
  for f in quick-buy-button stock-counter quick-view-modal promo-popup back-to-top; do
    test -f "Matrix Theme V3/snippets/$f.liquid" && echo "PASS: snippets/$f" || echo "FAIL: snippets/$f"
  done

  # === JS BUDGET ===
  echo "--- JS File Sizes ---"
  wc -c "Matrix Theme V3/assets/cart-drawer.js"       # <= 8192
  wc -c "Matrix Theme V3/assets/quick-buy.js"          # <= 6144
  wc -c "Matrix Theme V3/assets/collection-filters.js"  # <= 10240
  wc -c "Matrix Theme V3/assets/quick-view.js"          # <= 5120
  wc -c "Matrix Theme V3/assets/product-recommendations.js" # <= 5120
  wc -c "Matrix Theme V3/assets/recently-viewed.js"      # <= 5120
  wc -c "Matrix Theme V3/assets/countdown-timer.js"      # <= 5120
  wc -c "Matrix Theme V3/assets/promo-popup.js"          # <= 5120

  # === CODE QUALITY ===
  grep -r "{% include" "Matrix Theme V3/layout/" "Matrix Theme V3/templates/" "Matrix Theme V3/sections/" "Matrix Theme V3/snippets/" | wc -l
  # Assert: 0

  grep -r "fonts.googleapis.com\|fonts.gstatic.com" "Matrix Theme V3/" | wc -l
  # Assert: 0

  # === SETTINGS ===
  grep -c "enable_" "Matrix Theme V3/config/settings_schema.json"
  # Assert: >= 16 (11 new + 5 from V2)

  # === LOCALE KEYS ===
  grep -c "drawer_title\|order_note\|gift_wrap\|stock_low\|quick_buy\|quick_view\|recommended\|recently_viewed\|filter_title\|popup_close\|back_to_top\|countdown" "Matrix Theme V3/locales/en.default.json"
  # Assert: >= 10

  # === ACCESSIBILITY ===
  for f in cart-drawer quick-buy quick-view promo-popup collection-filters; do
    count=$(grep -c "aria-\|Escape\|focus" "Matrix Theme V3/assets/$f.js" 2>/dev/null)
    echo "$f.js accessibility markers: $count"
  done
  # Assert: each >= 2

  # === WEB COMPONENTS ===
  for f in cart-drawer quick-buy quick-view product-recommendations recently-viewed countdown-timer promo-popup collection-filters; do
    count=$(grep -c "customElements.define" "Matrix Theme V3/assets/$f.js" 2>/dev/null)
    echo "$f.js Web Components: $count"
  done
  # Assert: each >= 1

  # === CONDITIONAL LOADING ===
  grep -c "enable_.*asset_url" "Matrix Theme V3/layout/theme.liquid"
  # Assert: >= 8
  ```

  **Commit**: YES
  - Message: `feat(v3): complete integration QA and final verification`
  - Files: Any fixes found during QA

---

## Commit Strategy

| After Task | Message | Key Files |
|------------|---------|-----------|
| 1 | `feat(v3): copy V2 theme as V3 base` | Matrix Theme V3/ |
| 2 | `feat(v3): add foundation — cart events, money format, z-index, settings` | theme.js, product.js, theme.css, settings_schema.json |
| 3 | `feat(v3): add cart drawer with slide-out and floating bubble` | cart-drawer.liquid, cart-drawer.js |
| 4 | `feat(v3): add order notes and gift wrapping to cart` | cart-template.liquid, cart-drawer.liquid |
| 5 | `feat(v3): add quick buy button to product cards` | quick-buy-button.liquid, quick-buy.js |
| 6 | `feat(v3): add quick view modal` | quick-view-modal.liquid, quick-view.js |
| 7 | `feat(v3): add stock counter` | stock-counter.liquid |
| 8 | `feat(v3): add recommended products` | product-recommendations.liquid, product-recommendations.js |
| 9 | `feat(v3): add recently viewed products` | recently-viewed.liquid, recently-viewed.js |
| 10 | `feat(v3): add back-to-top button` | back-to-top.liquid |
| 11 | `feat(v3): add toggleable sticky header` | header.liquid |
| 12 | `feat(v3): add collection filtering and sorting` | collection-filters.liquid, collection-filters.js |
| 13 | `feat(v3): add promo banner` | promo-banner.liquid |
| 14 | `feat(v3): add promo popup` | promo-popup.liquid, promo-popup.js |
| 15 | `feat(v3): add countdown timer banner` | countdown-banner.liquid, countdown-timer.js |
| 16 | `feat(v3): complete integration QA` | Any fixes |

---

## Success Criteria

### Verification Commands
```bash
# Total new JS files
ls -1 "Matrix Theme V3/assets/"*.js | wc -l
# Assert: >= 11 (3 from V2 + 8 new)

# Total sections
ls -1 "Matrix Theme V3/sections/"*.liquid | wc -l
# Assert: >= 21 (16 from V2 + 5 new)

# Total snippets
ls -1 "Matrix Theme V3/snippets/"*.liquid | wc -l
# Assert: >= 7 (2 from V2 + 5 new)

# All features toggleable
grep -c '"enable_' "Matrix Theme V3/config/settings_schema.json"
# Assert: >= 16

# Total JS payload
cat "Matrix Theme V3/assets/"*.js | wc -c
# Assert: <= 80000 (80KB total)
```

### Final Checklist
- [ ] All 15+ features implemented
- [ ] All features toggleable and default OFF
- [ ] V3 with all features OFF = V2 output
- [ ] All JS files within per-file budgets
- [ ] Total JS payload < 80KB
- [ ] All overlays/modals accessible (focus trap, Escape, aria)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No `{% include %}`, no external CDN, no hardcoded `$`
- [ ] All locale keys present
- [ ] `shopify theme check` → 0 errors (if available)

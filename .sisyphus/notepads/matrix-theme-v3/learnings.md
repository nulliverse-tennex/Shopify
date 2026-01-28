# Matrix Theme V3 - Learnings

## Wave 1: Directory Copy & Version Metadata Update

### Completed Tasks
- ✅ Copied `Matrix Theme v2/` to `Matrix Theme V3/` (52 files)
- ✅ Updated `settings_schema.json`: theme_version "1.0.0" → "3.0.0"
- ✅ Updated `settings_schema.json`: theme_name "Matrix Terminal" → "Matrix Terminal V3"
- ✅ Updated `settings_data.json`: preset key "Matrix Terminal" → "Matrix Terminal V3"

### Key Findings
1. **Directory Structure**: Source has 52 files across standard Shopify theme directories (assets, config, layout, locales, sections, snippets, templates)
2. **JSON Format**: Both settings files are valid JSON with proper structure
3. **Metadata Locations**:
   - Version/name in `settings_schema.json`: theme_info object (lines 2-9)
   - Preset name in `settings_data.json`: presets object key (line 19)

### Verification Results
- Directory exists: ✅ PASS
- File count match (52 = 52): ✅ PASS
- Version "3.0.0" present: ✅ PASS (1 occurrence)
- Theme name "Matrix Terminal V3" in schema: ✅ PASS (1 occurrence)
- Preset name "Matrix Terminal V3" in data: ✅ PASS (1 occurrence)

### Next Wave Considerations
- V3 is now ready for section/snippet content updates
- All file paths remain consistent with V2 structure
- No breaking changes to directory layout

## Wave 2: Foundation Refactor (Task 2)

### Completed Changes
- ✅ Cart Events: `cart:updated` dispatched after `/cart/change.js` success; `addItemAdded()` method dispatches `cart:item-added`
- ✅ Money Format: `window.Shopify.moneyFormat` injected in theme.liquid; `formatMoney(cents)` global in theme.js supports all 5 Shopify format patterns
- ✅ product.js: Replaced hardcoded `$` with `formatMoney()` call via `formatPrice` wrapper (graceful fallback if global unavailable)
- ✅ Z-Index: 5 new CSS variables added to `:root` (back-to-top:50, sticky-cart:300, quick-view:800, cart-drawer:900, popup:950)
- ✅ Scroll Lock: `lockScroll()`/`unlockScroll()` with refcount closure (supports multiple overlays)
- ✅ Settings Schema: 5 new groups (Cart Features, Navigation, Product Highlights, Marketing & Promotions, Countdown Timer)
- ✅ Settings Data: All 27 new settings added to both `current` and `presets` with proper defaults
- ✅ Locale Keys: 30+ new keys across cart, product, collection, promo, countdown, navigation namespaces

### Key Decisions
1. **formatMoney supports all 5 Shopify money format patterns**: `{{amount}}`, `{{amount_no_decimals}}`, `{{amount_with_comma_separator}}`, `{{amount_no_decimals_with_comma_separator}}`, `{{amount_with_apostrophe_separator}}`
2. **product.js uses `formatPrice` wrapper** — checks if global `formatMoney` exists, with a minimal fallback (no currency symbol) to avoid breaking if script load order changes
3. **Z-index values chosen to avoid conflicts**: existing scale (base:1, dropdown:100, sticky:200, overlay:500, modal:1000, scanline:9999) was preserved; new values fit in gaps
4. **Scroll lock uses module-level `var`** (not closure IIFE) since theme.js is a single script — simpler, accessible by future feature files
5. **Settings organized into 5 groups** per plan spec — Cart Features has both drawer and enhancements; Product Highlights combines stock, quick buy, quick view, recommendations, recently viewed, and collection filtering
6. **All checkboxes default `false`** — V3 with all features off renders identically to V2

### Verification Results
All 9 acceptance criteria pass:
- Cart events: 2 ✅
- moneyFormat injection: 1 ✅  
- formatMoney function: 1 ✅
- product.js uses formatMoney: 2 ✅ (no hardcoded $)
- Z-index vars: 5 ✅
- Scroll lock: 2 ✅
- Settings groups: 9 matches ✅ (>= 5)
- Setting toggles: 11 ✅
- Locale keys: 14 matches ✅ (>= 10)
- All 3 JSON files validated as parseable ✅

### Files Modified (7)
1. `assets/theme.js` — formatMoney(), lockScroll/unlockScroll, CartManager events, section renumbering
2. `assets/product.js` — replaced hardcoded $ with formatPrice/formatMoney
3. `assets/theme.css` — 5 new z-index CSS variables
4. `layout/theme.liquid` — window.Shopify.moneyFormat injection
5. `config/settings_schema.json` — 5 new settings groups
6. `config/settings_data.json` — 27 new setting defaults in current + presets
7. `locales/en.default.json` — 30+ locale keys across 3 new namespaces + expanded existing ones

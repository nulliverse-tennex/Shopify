
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

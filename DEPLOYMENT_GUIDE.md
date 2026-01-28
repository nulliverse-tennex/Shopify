# Matrix Terminal Theme — Deployment Guide

## Overview

This is a complete Shopify Online Store 2.0 theme with a Matrix/terminal aesthetic. All code is production-ready and follows Shopify best practices.

## Theme Features

- **Matrix Aesthetic**: Green-on-black color scheme, monospace fonts (Fira Code + VT323), CRT scanline overlay
- **Visual Effects**: Canvas matrix rain (homepage, desktop only), typing animation (hero section), text glow
- **Fully Responsive**: Mobile-first design (375px → 1440px)
- **Accessible**: WCAG 2.1 AA compliant, `prefers-reduced-motion` support
- **Complete Pages**: Home, Collection, Product, Cart, Blog, Contact, About, 404, Customer accounts, Gift card, Password
- **Performance Optimized**: Self-hosted fonts, minimal JS (17KB total), single CSS file (21KB)

## File Structure

```
/
├── layout/
│   └── theme.liquid              # Base layout with @font-face inline
├── templates/
│   ├── *.json                    # 12 JSON templates (index, product, collection, etc.)
│   ├── gift_card.liquid          # Standalone gift card template
│   └── customers/
│       └── *.liquid              # 7 customer templates (login, register, account, etc.)
├── sections/
│   └── *.liquid                  # 16 sections (hero, product-template, cart-template, etc.)
├── snippets/
│   ├── product-card.liquid       # Reusable product card
│   └── pagination.liquid         # Terminal-style pagination
├── assets/
│   ├── theme.css                 # Complete design system (21KB)
│   ├── theme.js                  # Mobile menu + cart manager (7.8KB)
│   ├── product.js                # Variant picker Web Component (6KB)
│   ├── matrix-rain.js            # Canvas rain animation (3.1KB)
│   └── *.woff2                   # 4 self-hosted font files (126KB total)
├── config/
│   ├── settings_schema.json      # Theme settings (colors, toggles)
│   └── settings_data.json        # Default preset
└── locales/
    └── en.default.json           # English translations
```

## Prerequisites

### For Deployment
- Shopify Partner account (free): https://partners.shopify.com/
- Development store (created via Partner dashboard)
- Shopify CLI installed: `npm install -g @shopify/cli @shopify/theme`

### System Requirements
- Node.js 18+ (Shopify CLI requirement)
- **NOT compatible with WSL 1** (use WSL 2, macOS, or native Windows)

## Deployment Steps

### Option 1: Shopify CLI (Recommended)

1. **Install Shopify CLI** (if not already installed):
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Navigate to theme directory**:
   ```bash
   cd /path/to/theme
   ```

3. **Connect to your store**:
   ```bash
   shopify theme dev
   ```
   - Follow prompts to authenticate
   - Select your development store
   - Theme will open in browser with live reload

4. **Push to store** (when ready):
   ```bash
   shopify theme push
   ```
   - Select store
   - Choose whether to publish immediately or save as unpublished

### Option 2: Manual Upload via Admin

1. **Create theme ZIP**:
   ```bash
   zip -r matrix-theme.zip . -x "*.git*" -x ".sisyphus/*" -x "node_modules/*" -x "*.md"
   ```

2. **Upload to Shopify**:
   - Go to your store admin: `https://your-store.myshopify.com/admin`
   - Navigate to **Online Store → Themes**
   - Click **Add theme → Upload ZIP file**
   - Select `matrix-theme.zip`
   - Wait for upload to complete

3. **Preview and publish**:
   - Click **Customize** to preview
   - Click **Publish** when ready

### Option 3: GitHub Integration

1. **Push theme to GitHub repo**:
   ```bash
   git remote add origin https://github.com/your-username/matrix-theme.git
   git push -u origin master
   ```

2. **Connect in Shopify Admin**:
   - Go to **Online Store → Themes**
   - Click **Add theme → Connect from GitHub**
   - Authorize and select your repository
   - Shopify will auto-sync on every push

## Post-Deployment Configuration

### 1. Theme Settings

Navigate to **Customize theme** and configure:

- **Colors**:
  - Accent color: `#00ff41` (Matrix green)
  - Background: `#000000`
  - Panel background: `#0a0a0a`
  - Text color: `#e0e0e0`

- **Effects** (toggle on/off):
  - Enable scanlines overlay
  - Enable matrix rain (homepage)
  - Enable typing animation (hero)

### 2. Navigation Menus

Create menus in **Navigation** section:

- **Main menu** (`main-menu`):
  - Home
  - Shop (link to collection)
  - About (link to page)
  - Contact (link to /pages/contact)

- **Footer menu** (`footer`):
  - Privacy Policy
  - Terms of Service
  - Refund Policy

### 3. Homepage Sections

In theme customizer, configure homepage sections:

- **Hero**:
  - Heading: Your store tagline
  - Subtext: Brief description
  - Button text: "ENTER_SHOP"
  - Button link: Link to main collection
  - Enable typing animation: ✓

- **Featured Collection**:
  - Select a collection
  - Number of products: 8
  - Section title: "FEATURED_PRODUCTS"

- **Rich Text** (About):
  - Heading: "ABOUT_US"
  - Body: Your store description

### 4. Add Test Products

For full functionality testing:

1. Add at least 3 products with:
   - Multiple images
   - Variants (size/color)
   - Inventory tracking

2. Create a collection and assign products

3. Test cart flow:
   - Add product → View cart → Change quantity → Remove → Empty state

## Verification Checklist

After deployment, verify:

- [ ] **Theme Check**: Run `shopify theme check --fail-level error` (should return 0 errors)
- [ ] **All pages render**: Home, Collection, Product, Cart, Blog, Contact, 404, Customer pages
- [ ] **No console errors**: Open browser DevTools on each page type
- [ ] **Responsive**: Test at 375px (mobile) and 1440px (desktop) — no overflow or broken layouts
- [ ] **Accessibility**: Run Lighthouse audit (score should be ≥90 on all pages)
- [ ] **Cart flow**: Add to cart → view cart → change qty → remove → empty state
- [ ] **Effects work**:
   - Matrix rain appears on homepage (desktop only)
   - Typing animation runs on hero (if enabled)
   - Scanlines overlay visible (if enabled)
- [ ] **Reduced motion**: Enable in browser DevTools → all animations should stop
- [ ] **Empty states**: Test empty cart, empty collection, no search results, 404 page

## Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Performance Budget

All assets are within budget:

| Asset | Size | Budget | Status |
|-------|------|--------|--------|
| theme.css | 21KB | 50KB | ✓ |
| theme.js | 7.8KB | 30KB | ✓ |
| product.js | 6KB | 15KB | ✓ |
| matrix-rain.js | 3.1KB | 5KB | ✓ |
| Fonts (total) | 126KB | 200KB | ✓ |

## Troubleshooting

### Theme Check Errors

If `shopify theme check` reports errors:

1. **ParserBlockingScript**: Ensure all `<script>` tags use `defer` attribute
2. **MissingAsset**: Verify all referenced files exist in `assets/`
3. **ValidSchema**: Check section schemas for invalid properties (e.g., `templates`)
4. **TranslationKeyExists**: Add missing keys to `locales/en.default.json`

### Matrix Rain Not Appearing

Check:
- Body has `rain-enabled` class (set in theme settings)
- Viewport width ≥ 768px (disabled on mobile)
- `prefers-reduced-motion` is NOT set to `reduce`
- Browser console for JS errors

### Typing Animation Not Working

Check:
- Hero section has element with `typewriter` class
- Element has `data-text` attribute with text to type
- `prefers-reduced-motion` is NOT set to `reduce`
- Theme settings has typing animation enabled

### Cart Not Updating

Check:
- Browser console for fetch errors
- Shopify routes are available: `window.Shopify.routes.root`
- Cart API endpoints are accessible: `/cart/add.js`, `/cart/change.js`

## Customization Guide

### Changing Colors

Edit `config/settings_data.json` or use theme customizer:

```json
{
  "current": {
    "accent_color": "#00ff41",
    "background_color": "#000000",
    "panel_background": "#0a0a0a",
    "text_color": "#e0e0e0"
  }
}
```

### Adding New Sections

1. Create `sections/your-section.liquid`
2. Add `{% schema %}` block with settings
3. Reference in JSON template or add via theme customizer

### Modifying Fonts

1. Replace font files in `assets/`
2. Update `@font-face` declarations in `layout/theme.liquid`
3. Update CSS custom properties in `assets/theme.css`:
   ```css
   --font-body: 'Your Font', monospace;
   --font-heading: 'Your Heading Font', monospace;
   ```

### Disabling Effects

In theme customizer:
- Uncheck "Enable scanlines overlay"
- Uncheck "Enable matrix rain"
- Uncheck "Enable typing animation"

Or edit `config/settings_data.json`:
```json
{
  "enable_scanlines": false,
  "enable_matrix_rain": false,
  "enable_typing_animation": false
}
```

## Support & Resources

### Shopify Documentation
- Theme architecture: https://shopify.dev/docs/storefronts/themes/architecture
- Liquid reference: https://shopify.dev/docs/api/liquid
- Section schemas: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema
- Cart API: https://shopify.dev/docs/api/ajax/reference/cart

### Theme Development
- Shopify CLI: https://shopify.dev/docs/themes/tools/cli
- Dawn reference theme: https://github.com/Shopify/dawn
- Theme check: https://shopify.dev/docs/themes/tools/theme-check

### Accessibility
- WCAG 2.1 guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

## License

This theme is provided as-is for use with Shopify stores. Modify and customize as needed for your store.

## Credits

- **Fonts**: Fira Code (Nikita Prokopov), VT323 (Peter Hull)
- **Architecture**: Based on Shopify Dawn theme patterns
- **Matrix aesthetic**: Inspired by The Matrix (1999)

---

**Built with**: Vanilla Liquid + CSS + JavaScript (no frameworks, no build tools)

**Compatible with**: Shopify Online Store 2.0

**Last updated**: January 2026

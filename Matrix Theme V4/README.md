# Matrix Terminal Theme V4

A Shopify Online Store 2.0 theme with a Matrix/terminal aesthetic. Green-on-black color scheme, monospace fonts, CRT scanline overlay, and canvas-based digital rain.

## Installation

1. Download or clone this repository
2. Shopify Admin > Online Store > Themes > Add theme > Upload zip
3. Click **Customize** to configure settings before publishing

## Demo Store Testing Guide

### Prerequisites

- Shopify store with sample products, collections, and blog articles
- Products with multiple variants (size, color) for variant testing
- At least one product with limited inventory (for stock counter testing)
- At least one product with a compare-at price (for sale badge testing)

---

### 1. Theme Settings (Customize > Theme Settings)

Before testing pages, enable all features in the theme editor:

| Setting | Location | Set To |
|---------|----------|--------|
| Scanlines | Effects | ON |
| Matrix Rain | Effects | ON |
| Typing Animation | Effects | ON |
| Text Glow | Effects | ON |
| CRT Flicker | Effects | ON |
| Cart Drawer | Cart | ON (type: drawer) |
| Order Notes | Cart | ON |
| Gift Wrapping | Cart | ON |
| Sticky Header | Navigation | ON |
| Back to Top | Navigation | ON |
| Stock Counter | Products | ON (threshold: 10) |
| Quick Buy | Products | ON |
| Quick View | Products | ON |
| Recommended Products | Products | ON |
| Recently Viewed | Products | ON |
| Collection Filtering | Products | ON |
| Promo Banner | Promotions | ON |
| Promo Popup | Promotions | ON (type: email, delay: 5s) |

---

### 2. Homepage

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Page load | Matrix rain animation fills entire screen background |
| 2 | Hero section | Heading types out character-by-character |
| 3 | Hero CTA button | Hover shows glow effect, click navigates to link |
| 4 | Featured collection | Product grid displays (4 products, responsive) |
| 5 | Resize to < 768px | Matrix rain stops, layout switches to single column |
| 6 | Scroll down 300px+ | Back-to-top button appears (bottom right) |
| 7 | Click back-to-top | Smooth scroll to top |
| 8 | Scanline overlay | Faint horizontal lines visible across entire page |

---

### 3. Header & Navigation

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Desktop nav links | Hover glow effect, active page highlighted |
| 2 | Cart icon | Shows item count badge (updates on add-to-cart) |
| 3 | Scroll down | Header stays fixed at top (sticky header) |
| 4 | Resize to mobile | Hamburger icon appears, nav links hidden |
| 5 | Tap hamburger | Menu slides out, overlay appears |
| 6 | Tap overlay | Menu closes |
| 7 | Press Escape | Menu closes |
| 8 | Tab through menu | Focus stays trapped inside menu |

---

### 4. Collection Page

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Product grid | Cards show image, title, price |
| 2 | Sale product | Shows sale badge + strikethrough compare-at price |
| 3 | Sold out product | Shows sold-out badge, quick-buy disabled |
| 4 | Quick Buy (single variant) | Click adds directly to cart, cart drawer opens |
| 5 | Quick Buy (multi-variant) | Click opens quick-view modal |
| 6 | Filter sidebar | Checkboxes filter products (AJAX, no page reload) |
| 7 | Price range filter | Min/max inputs filter after 500ms debounce |
| 8 | Active filters | Shows tags with remove buttons, "Clear all" link |
| 9 | Pagination | Navigate between pages |

---

### 5. Product Page

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Product images | Gallery displays with lazy loading |
| 2 | Select variant | Price updates, URL updates with `?variant=ID` |
| 3 | Select sold-out variant | Button changes to "Sold Out", disabled |
| 4 | Stock counter (low stock) | Shows "> WARNING: Only X left in stock_" |
| 5 | Stock counter (out of stock) | Shows "> ERROR: OUT OF STOCK_" |
| 6 | Quantity +/- buttons | Increment/decrement quantity |
| 7 | Add to cart | Cart drawer slides open with item added |
| 8 | Recommended products | Related products grid loads below product |
| 9 | Navigate away, return | Recently viewed section shows previous product |

---

### 6. Cart Drawer

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Opens on add-to-cart | Slides in from right with overlay |
| 2 | Item display | Image, title, variant, price, quantity, line total |
| 3 | Quantity +/- | Updates quantity and subtotal (AJAX) |
| 4 | Remove item | Item removed, cart updates |
| 5 | Order notes | Textarea visible, accepts input |
| 6 | Gift wrapping | Checkbox with message field appears |
| 7 | Click overlay | Drawer closes |
| 8 | Press Escape | Drawer closes |
| 9 | Tab key | Focus trapped inside drawer |
| 10 | Empty cart | Shows "Cart is empty" with continue shopping link |
| 11 | Checkout button | Navigates to Shopify checkout |

---

### 7. Cart Page (/cart)

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Item rows | Image, title, variant, price, quantity, total |
| 2 | Quantity update | +/- buttons update quantity |
| 3 | Remove item [DEL] | Item removed from cart |
| 4 | Empty cart | Shows empty state |

---

### 8. Promo Banner

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Page load | Banner visible above header |
| 2 | Click close button | Banner dismissed |
| 3 | Refresh page | Banner stays dismissed (localStorage) |
| 4 | Clear localStorage | Banner reappears |

---

### 9. Promo Popup

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Wait 5 seconds | Popup appears with overlay |
| 2 | Submit email | Form submits to Shopify contacts |
| 3 | Click close button | Popup dismissed |
| 4 | Click overlay | Popup dismissed |
| 5 | Press Escape | Popup dismissed |
| 6 | Refresh page | Popup does NOT reappear (7-day localStorage) |
| 7 | Tab key | Focus trapped inside popup |

---

### 10. Other Pages

| Page | Test |
|------|------|
| **Blog** (/blogs) | Article listing renders with titles and dates |
| **Article** | Full article content, formatted text |
| **Contact** (/pages/contact) | Form submits, shows "> MESSAGE_SENT // TRANSMISSION COMPLETE_" |
| **Search** (/search) | Search input works, results display |
| **404** | Custom 404 page with terminal aesthetic |
| **Password** | Password form with Matrix styling (test via theme preview) |

---

### 11. Responsive Breakpoints

Test all pages at these widths:

| Breakpoint | What Changes |
|------------|-------------|
| **< 768px** (Mobile) | Single column, hamburger menu, matrix rain disabled |
| **768 - 1024px** (Tablet) | 2-column grids, condensed header |
| **> 1024px** (Desktop) | Full layout, 4-column grids, matrix rain active |

---

### 12. Accessibility

| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Enable "Reduce Motion" in OS | All animations disabled instantly (rain, typing, glow) |
| 2 | Keyboard-only navigation | All interactive elements reachable via Tab |
| 3 | Focus indicators | Visible focus ring on all focusable elements |
| 4 | Modals (cart drawer, quick view, popup) | Focus trapped, Escape closes |
| 5 | Images | Alt text present on all product images |
| 6 | Forms | Labels associated with inputs |

---

### 13. Browser Testing

| Browser | Priority |
|---------|----------|
| Chrome (latest) | Required |
| Safari (latest) | Required |
| Firefox (latest) | Required |
| Edge (latest) | Recommended |
| Safari iOS | Required |
| Chrome Android | Required |

---

## File Structure

```
assets/          JS, CSS, fonts
config/          Theme settings
layout/          Base template (theme.liquid)
locales/         Translations (en)
sections/        Page sections (18 files)
snippets/        Reusable components (9 files)
templates/       Page templates (12 files)
```

## Tech Stack

- **Fonts**: Fira Code (body), VT323 (accents) - self-hosted WOFF2
- **JS**: Vanilla JS, Web Components, no frameworks (17KB total)
- **CSS**: Single file, CSS custom properties (21KB)
- **Platform**: Shopify Online Store 2.0, Section Rendering API

# Ivan Li's Website - Modernization Guide

## Overview

This website has been modernized for better performance, mobile experience, and maintainability while preserving the original design and color scheme.

## Quick Start

### Current Setup (Immediate Use)
The existing HTML files have been optimized and can be used as-is:
- Font loading optimized with `preconnect` and `font-display: swap`
- JavaScript deferred for faster initial page load
- Meta descriptions added for SEO
- Proper DOCTYPE and lang attributes for accessibility

### Full Modern Setup (Eleventy)
For the best experience and easier maintenance, use the Eleventy static site generator:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Changes Made

### Performance Optimizations

1. **Font Loading**
   - Added `preconnect` hints for Google Fonts and Google Analytics
   - Fonts now load with `display=swap` to prevent invisible text during load
   - Moved `@import` statements to `<link>` tags in HTML

2. **JavaScript Loading**
   - All scripts now use `defer` attribute
   - Scripts load in parallel without blocking page render
   - Non-critical JS loads after initial content

3. **CSS Improvements**
   - Added CSS custom properties (variables) for easier theming
   - Created modern.css with CSS Grid, Flexbox, and modern selectors
   - Removed unused vendor prefixes

### New Files Created

```
├── package.json              # Node.js dependencies for Eleventy
├── eleventy.config.js        # Eleventy configuration
├── assets/
│   ├── css/modern.css        # Modern CSS (optional replacement)
│   ├── icons.svg             # SVG icon sprite (replaces Font Awesome)
│   └── js/main.modern.js     # Vanilla JS (optional replacement)
└── src/                      # Eleventy source files
    ├── _data/
    │   ├── site.json         # Site-wide data
    │   └── navigation.json   # Navigation menu structure
    ├── _includes/
    │   ├── header.njk        # Header partial
    │   ├── footer.njk        # Footer partial
    │   └── icons.njk         # SVG icons partial
    ├── _layouts/
    │   └── base.njk          # Base layout template
    └── fun.njk               # Example converted page
```

### Archived Files

Unused CSS/JS files moved to `old files/archived_css/` and `old files/archived_js/`:
- w3.css
- style.css
- cover.css
- math.css
- math_v2.css
- sidebar.js

## Color Scheme (Preserved)

| Color | Hex | Usage |
|-------|-----|-------|
| UTD Gold | #FFB612 | Primary background |
| UTD Blue | #006CB8 | Links, accents |
| Dark Blue | #00548f | Hover states |
| Dark Green | #154734 | Header, footer |
| Black | #000000 | Text |
| White | #ffffff | Light text |

## Mobile Improvements

- Proper viewport meta tag
- Touch-friendly tap targets
- Responsive images with lazy loading
- Better mobile navigation
- Reduced motion support for accessibility

## Future Improvements

### Recommended
1. Convert remaining HTML pages to Eleventy templates
2. Replace Font Awesome with the new SVG icon system
3. Add WebP image format with fallbacks
4. Implement service worker for offline support

### Optional
1. Add CSS minification in build process
2. Implement image optimization pipeline
3. Add sitemap.xml generation
4. Set up continuous deployment

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## Accessibility

- Proper heading hierarchy
- ARIA labels on interactive elements
- Skip navigation link support
- Focus visible indicators
- Reduced motion preferences respected

## Performance Metrics (Expected)

With these optimizations, you should see improvements in:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

Test your site at [PageSpeed Insights](https://pagespeed.web.dev/) to verify improvements.

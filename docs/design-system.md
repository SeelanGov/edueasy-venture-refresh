# EduEasy Design System

## Overview
This design system provides consistent visual language and interaction patterns across the EduEasy platform using semantic tokens and WCAG AA compliance.

## Color System

### Semantic Tokens
Our color system is built on CSS variables that automatically adapt to light and dark themes:

```css
/* Status Colors */
--success-hue: 142;     /* Green for success states */
--warning-hue: 43;      /* Yellow/orange for warnings */
--error-hue: 0;         /* Red for errors */
--info-hue: 217;        /* Blue for information */

/* Brand Colors */
--cap-teal-hue: 174;    /* Primary brand color */
--cap-coral-hue: 12;    /* Secondary brand color */
```

### Usage Guidelines

#### ✅ DO - Use Semantic Variants
```tsx
// Use Badge with semantic variants
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>

// Use status mapping utility
<Badge variant={mapStatusToBadgeVariant(status)}>
  {status}
</Badge>
```

#### ❌ DON'T - Use Raw Colors
```tsx
// Never use hex colors
<Badge className="bg-#22c55e text-white">Approved</Badge>

// Never use fixed Tailwind palettes
<Badge className="bg-green-500 text-white">Approved</Badge>

// Never use inline ternaries for colors
<Badge className={status === 'approved' ? 'bg-green-100' : 'bg-red-100'}>
  {status}
</Badge>
```

## Badge Component

### Variants
- `success` - For completed, approved, active states
- `warning` - For pending, in-progress, under-review states  
- `destructive` - For failed, rejected, expired states
- `info` - For draft, new, unknown states
- `muted` - Default fallback variant

### Status Mapping
The `mapStatusToBadgeVariant()` utility provides consistent status-to-variant mapping:

```tsx
// Automatic mapping
const variant = mapStatusToBadgeVariant('approved'); // returns 'success'
const variant = mapStatusToBadgeVariant('pending');  // returns 'warning'
const variant = mapStatusToBadgeVariant('failed');   // returns 'destructive'
```

## Accessibility

### Focus Management
All interactive elements use visible focus rings with proper contrast:

```css
.focus-visible-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}
```

### Reduced Motion
Respects `prefers-reduced-motion` user setting:

```tsx
import { getMotionClasses } from '@/utils/accessibility';

// Conditionally apply animations
<div className={getMotionClasses('animate-fade-in', 'opacity-100')}>
  Content
</div>
```

### Touch Targets
All interactive elements meet minimum 44x44px touch target size:

```css
.touch-target {
  @apply min-w-[44px] min-h-[44px] flex items-center justify-center;
}
```

### Screen Reader Support
Use semantic HTML and ARIA labels:

```tsx
import { screenReader } from '@/utils/accessibility';

// Announce status changes
screenReader.announce('Payment processed successfully');

// Add screen reader only text
<span className="sr-only">Current status:</span>
<Badge variant="success">Approved</Badge>
```

## Development Guidelines

### Color Validation
ESLint rules prevent color violations:

```bash
# Check for violations
npm run lint

# Check colors specifically  
bash scripts/check-colors.sh
```

### Testing
- Storybook stories demonstrate light/dark themes
- @storybook/addon-a11y validates accessibility
- All components meet WCAG AA standards

## Migration Guide

### From Hardcoded Colors
```tsx
// Before
<span className="bg-green-100 text-green-800 px-2 py-1 rounded">
  {status}
</span>

// After
<Badge variant={mapStatusToBadgeVariant(status)}>
  {status}
</Badge>
```

### Color System Benefits
- ✅ Automatic light/dark mode support
- ✅ Consistent status mapping
- ✅ WCAG AA contrast ratios
- ✅ Reduced bundle size (no hardcoded colors)
- ✅ Type-safe variants
- ✅ ESLint protection against regressions
# Accessibility Checklist (WCAG AA)

## Overview
This checklist ensures EduEasy meets WCAG AA accessibility standards for all users, including those using assistive technologies.

## ✅ Focus Management

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and predictable
- [ ] Focus indicators are visible with 3:1 contrast ratio
- [ ] No keyboard traps (except intentional, like modals)
- [ ] Skip links provided for main content

### Focus Indicators
```css
/* Ensure visible focus rings */
.focus-visible-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}
```

## ✅ Color and Contrast

### Requirements
- [ ] Text contrast: 4.5:1 for normal text, 3:1 for large text
- [ ] Interactive element contrast: 3:1 minimum
- [ ] Color is not the only means of conveying information
- [ ] Status changes are announced to screen readers

### Implementation
```tsx
// Use semantic Badge variants for status
<Badge variant={mapStatusToBadgeVariant(status)}>
  <span className="sr-only">Status: </span>
  {status}
</Badge>
```

## ✅ Touch Targets

### Requirements
- [ ] Minimum 44×44 pixels for touch targets
- [ ] Adequate spacing between touch targets
- [ ] Touch targets work on mobile devices

### Validation
```tsx
import { validateTouchTarget } from '@/utils/accessibility';

// Validate programmatically
const isValidSize = validateTouchTarget(buttonElement);
```

## ✅ Motion and Animation

### Requirements
- [ ] Respect `prefers-reduced-motion` setting
- [ ] No flashing content (seizure prevention)
- [ ] Animations can be paused/stopped
- [ ] Auto-playing content has controls

### Implementation
```tsx
import { getMotionClasses } from '@/utils/accessibility';

// Conditional animations
<div className={getMotionClasses('animate-fade-in', 'opacity-100')}>
  Content
</div>
```

## ✅ Screen Reader Support

### Semantic HTML
- [ ] Use proper heading hierarchy (h1 → h2 → h3)
- [ ] Use semantic elements (`<nav>`, `<main>`, `<section>`, etc.)
- [ ] Form labels are properly associated
- [ ] Images have descriptive alt text

### ARIA Attributes
- [ ] `aria-label` for elements without visible text
- [ ] `aria-describedby` for additional context
- [ ] `aria-live` regions for dynamic content
- [ ] `aria-expanded` for collapsible content

### Live Regions
```tsx
import { screenReader } from '@/utils/accessibility';

// Announce status changes
screenReader.announce('Payment processed successfully', 'polite');
```

## ✅ Forms

### Requirements
- [ ] All form controls have labels
- [ ] Error messages are clearly associated
- [ ] Required fields are indicated
- [ ] Form validation is accessible

### Implementation
```tsx
<div>
  <label htmlFor="email" className="block text-sm font-medium">
    Email Address
    <span className="text-destructive" aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-error"
    className="focus-visible-ring"
  />
  <div id="email-error" role="alert" className="text-destructive text-sm">
    Please enter a valid email address
  </div>
</div>
```

## ✅ Images and Media

### Requirements
- [ ] Images have appropriate alt text
- [ ] Decorative images use empty alt=""
- [ ] Complex images have detailed descriptions
- [ ] Videos have captions and transcripts

## ✅ Testing Tools

### Automated Testing
- **Storybook a11y addon**: `@storybook/addon-a11y`
- **ESLint**: `eslint-plugin-jsx-a11y`
- **axe-core**: Browser extension for runtime testing

### Manual Testing
- [ ] Test with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode

### Storybook Integration
```tsx
// Each story automatically checked for a11y violations
export default {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  }
};
```

## ✅ Common Patterns

### Status Indicators
```tsx
// Accessible status badge
<Badge variant={mapStatusToBadgeVariant(status)} role="status">
  <span className="sr-only">Current status: </span>
  {status}
</Badge>
```

### Loading States
```tsx
// Accessible loading indicator
<div role="status" aria-live="polite">
  <Spinner size="sm" />
  <span className="sr-only">Loading...</span>
</div>
```

### Error Messages
```tsx
// Accessible error announcement
<div role="alert" className="text-destructive">
  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
  Error: Please check your input
</div>
```

## 🔧 Development Workflow

1. **Design Phase**: Ensure designs meet contrast requirements
2. **Development**: Use semantic components and utilities
3. **Testing**: Run Storybook a11y checks
4. **QA**: Manual testing with assistive technologies
5. **Production**: Monitor for accessibility regressions

## 📚 Resources

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe Browser Extension](https://www.deque.com/axe/browser-extensions/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
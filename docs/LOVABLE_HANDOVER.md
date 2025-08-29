# **LOVEABLE.DEV HANDOVER: Guardrails + Design System Polish**

## **📋 Handover Summary**

**From**: Cursor (AI Assistant)  
**To**: Loveable.dev Team  
**Date**: Current  
**Status**: Color token unification complete, guardrails & polish pending  

---

## **✅ What's Already Done (Cursor's Work)**

### **Color Token Unification - COMPLETE**
- **59+ hardcoded colors removed** from 15 components
- **Semantic design tokens** established in `src/index.css` and `src/lib/design-tokens.ts`
- **15 components updated** to use consistent color system
- **Pre-commit hook fixed** (simplified to essential checks)
- **PR #12 created** and ready for merge: https://github.com/SeelanGov/edueasy-venture-refresh/pull/12

### **Components Updated**
1. `PartnerIntegrationChecklist.tsx` - Status icons and help text
2. `PartnerProfile.tsx` - Labels, icons, links, payment records
3. `PartnerStatusBadge.tsx` - Status badge colors
4. `DocumentUploadStepper.tsx` - Multi-step process styling
5. `JourneyMilestone.tsx` - Milestone status indicators
6. `SponsorCard.tsx` - Tier and status indicators
7. `SponsorPaymentHistory.tsx` - Status pills and history
8. `SponsorStudentTable.tsx` - Status pills and buttons
9. `PlanLimitWarning.tsx` - Warning borders and text
10. `FeedbackSystem.tsx` - Feedback button states
11. `MessageRow.tsx` - Text colors
12. Plus 3 additional components

---

## **🎯 What Loveable.dev Needs to Complete**

### **Phase 1: Guardrails & CI (High Priority)**

#### **1. ESLint Color Rules**
- **File**: `.eslintrc.cjs`
- **Goal**: Block hardcoded hex colors and fixed Tailwind palette classes
- **Implementation**: Use `eslint-plugin-regex` to catch:
  - `#[0-9A-Fa-f]{3,6}` (hex colors)
  - `(bg|text|border)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}` (fixed palette)

#### **2. CI Workflow**
- **File**: `.github/workflows/ui-guardrails.yml`
- **Goal**: Automated checks on PRs
- **Checks**: `lint`, `typecheck`, `build`, `color-check`
- **Triggers**: `pull_request` to `main` and `develop`

#### **3. Color Check Script**
- **File**: `scripts/check-colors.sh`
- **Goal**: Source-only scan for hardcoded colors
- **Implementation**: Bash script using `git grep` patterns
- **Integration**: Called by CI workflow and pre-commit hook

### **Phase 2: Design System Documentation (Medium Priority)**

#### **4. Design System Guide**
- **File**: `docs/design-system.md`
- **Content**:
  - Color token definitions and usage
  - Component examples (light/dark modes)
  - Accessibility guidelines (AA contrast)
  - Best practices and anti-patterns

#### **5. Badge Component Migration**
- **Goal**: Replace all status pills with `<Badge>` component
- **Variants**: `success`, `info`, `neutral`, `warning`, `destructive`, `secondary`
- **Implementation**: Use shadcn/ui Badge component

### **Phase 3: Polish Layer (Lower Priority)**

#### **6. Storybook Integration**
- **Goal**: Visual component library with light/dark examples
- **Components**: All updated components (Stepper, Payment rows, Feedback, etc.)
- **Themes**: Light and dark mode variants

#### **7. Accessibility CI**
- **Tool**: Axe-core integration
- **Goal**: Zero critical accessibility violations
- **Integration**: Storybook + CI pipeline

---

## **🔧 Technical Implementation Notes**

### **ESLint Configuration**
```javascript
// .eslintrc.cjs
{
  "plugins": ["regex"],
  "rules": {
    "regex/invalid": [
      "error",
      {
        "regex": "#[0-9a-fA-F]{3,6}\\b",
        "message": "Use semantic color tokens instead of hex colors"
      },
      {
        "regex": "\\b(bg|text|border)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\\b",
        "message": "Use semantic color tokens instead of fixed Tailwind palette"
      }
    ]
  }
}
```

### **CI Workflow Structure**
```yaml
# .github/workflows/ui-guardrails.yml
name: UI Guardrails
on:
  pull_request:
    branches: [main, develop]
jobs:
  guardrails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: bash scripts/check-colors.sh
```

### **Color Check Script**
```bash
#!/bin/bash
set -euo pipefail

echo "🔍 Checking for hex colors..."
if git grep -nE '#[0-9a-fA-F]{3,6}\b' -- . ':(exclude)scripts' ':(exclude)node_modules' ':(exclude).git'; then
  echo "❌ Hex colors found — use semantic tokens instead"
  exit 1
fi

echo "🔎 Checking for fixed Tailwind palette colors..."
if git grep -nE '\b(bg|text|border)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\b' -- . ':(exclude)scripts' ':(exclude)node_modules' ':(exclude).git'; then
  echo "❌ Fixed Tailwind palette colors found — use semantic tokens instead"
  exit 1
fi

echo "✅ No hardcoded colors found — all using semantic tokens."
```

---

## **📁 File Structure for Loveable.dev**

```
edueasy-venture-refresh/
├── .eslintrc.cjs                    # ESLint color rules
├── .github/workflows/
│   └── ui-guardrails.yml           # CI workflow
├── scripts/
│   └── check-colors.sh             # Color validation script
├── docs/
│   └── design-system.md            # Design system guide
├── src/components/ui/
│   └── Badge.tsx                   # Badge component (if needed)
└── .storybook/                      # Storybook configuration
```

---

## **🚀 Implementation Order**

### **Week 1: Guardrails (Critical)**
1. ESLint color rules
2. Color check script
3. CI workflow

### **Week 2: Documentation**
1. Design system guide
2. Badge component migration
3. Update pre-commit hook to include color check

### **Week 3: Polish**
1. Storybook setup
2. Accessibility CI
3. Final testing and validation

---

## **📊 Success Metrics**

### **Guardrails**
- [ ] ESLint catches all hardcoded colors
- [ ] CI workflow runs on all PRs
- [ ] Color check script passes on clean codebase

### **Documentation**
- [ ] Design system guide complete
- [ ] All status pills use Badge component
- [ ] Component examples documented

### **Polish**
- [ ] Storybook shows light/dark variants
- [ ] Zero critical accessibility violations
- [ ] CI pipeline green on all checks

---

## **🔗 Related Resources**

- **PR #12**: https://github.com/SeelanGov/edueasy-venture-refresh/pull/12
- **Color Token System**: `src/index.css` and `src/lib/design-tokens.ts`
- **Updated Components**: See list above
- **Pre-commit Hook**: `.husky/pre-commit` (already fixed)

---

## **📞 Handover Notes**

- **Current Branch**: `chore/ui-tokenization-and-guardrails-final`
- **Base Branch**: `main` (not `develop`)
- **Dependencies**: `eslint-plugin-regex` needed for color rules
- **Node Version**: 20 (as specified in CI)
- **Build Tool**: Vite (not Next.js)

**Status**: Ready for Loveable.dev to take over guardrails and polish work.

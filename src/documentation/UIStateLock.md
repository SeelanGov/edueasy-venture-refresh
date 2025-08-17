# UI State Lock Documentation

## Lock Created: 2025-06-12

### Current Locked State Summary

- **Version**: ✅ UI LOCKED - 2025-06-12 - Stable Commit
- **Total Components**: 47
- **Total Routes**: 15
- **Pricing Model**: Once-off payments
- **Status**: LOCKED ✅

### Key Features Locked

1. **Once-off Pricing System**: No recurring subscriptions
2. **Tiered Features**: Starter, Essential, Pro + AI
3. **Premium Feature Gating**: Career guidance and consultations
4. **Navigation**: All links functional and tested
5. **Authentication Flow**: Register/login system stable

### Locked Components

#### Core Application

- `App.tsx` - Main application with routing
- `main.tsx` - Application entry point
- `AuthContext.tsx` - Authentication provider

#### Navigation & Layout

- `Navbar.tsx` - Main navigation with all working links
- `DashboardLayout.tsx` - Dashboard layout system
- `DashboardSidebar.tsx` - Sidebar navigation

#### Pages (Locked)

- `Index.tsx` - Homepage with hero and sections
- `CareerGuidancePage.tsx` - Career guidance with tiered access
- `ConsultationsPage.tsx` - Expert consultations with premium gating
- `SubscriptionPage.tsx` - Subscription management
- `Pricing.tsx` - Pricing page with once-off model
- `Dashboard.tsx` - User dashboard
- `Register.tsx` - User registration

#### Subscription System

- `SubscriptionTierCard.tsx` - Displays tier information
- `PremiumFeature.tsx` - Gates premium features
- `useSubscription.ts` - Subscription logic hook
- `SubscriptionTypes.ts` - Type definitions

#### UI Components

- `Typography.tsx` - Typography system
- All shadcn/ui components (locked versions)

### Routes Configuration

```typescript
Public Routes:
- / (Index)
- /pricing
- /meet-thandi
- /institutions
- /faqs
- /sponsorships
- /checkout
- /career-guidance
- /consultations
- /register

Protected Routes:
- /dashboard
- /profile-demo
- /profile-completion
- /subscription

Admin Routes:
- /partner-dashboard
- /admin/ui-lock
```

### Design System (Locked)

- **Colors**: cap-teal primary, semantic color tokens
- **Typography**: Responsive typography scales
- **Components**: shadcn/ui component library
- **Layout**: Container-based responsive layouts

### Subscription Tiers (Locked)

1. **Starter** (Free)
   - 1 application
   - 5 documents
   - Basic Thandi

2. **Essential** (R199 once-off)
   - 3 applications
   - 20 documents
   - Document verification
   - Career guidance
   - Thandi guidance tier

3. **Pro + AI** (R300 once-off)
   - 6 applications
   - Unlimited documents
   - Priority support
   - Advanced Thandi
   - Expert consultations

### Backup Status

- ✅ GitHub sync active
- ✅ Component inventory documented
- ✅ Route mapping complete
- ✅ Type definitions preserved
- ✅ Design system documented

### Rollback Instructions

To restore this exact state:

1. Access `/admin/ui-lock` (admin only)
2. Select "✅ UI LOCKED - 2025-06-12 - Stable Commit"
3. Click "Restore"
4. Confirm rollback operation

### Change Monitoring

The following components are monitored for unauthorized changes:

- All subscription-related components
- Navigation components
- Core routing configuration
- Premium feature gating logic
- Pricing display components

### Security Notes

- Admin-only access to UI lock system
- Component change detection active
- Automatic backup on any modifications
- 24-hour collaboration lock enabled

---

**CRITICAL**: This UI state represents a fully functional once-off pricing model. Any changes should
be carefully reviewed and tested before implementation.

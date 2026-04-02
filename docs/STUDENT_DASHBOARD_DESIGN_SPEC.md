# EduEasy Student Dashboard — Full Design & UI Specification

> **Purpose**: Hand-off document for designers. Describes every visual element, layout rule, color token, spacing convention, responsive breakpoint, and component hierarchy used in the Student Dashboard.

---

## Table of Contents

1. [Page Architecture](#1-page-architecture)
2. [Layout System](#2-layout-system)
3. [Color System & Design Tokens](#3-color-system--design-tokens)
4. [Typography](#4-typography)
5. [Sidebar Navigation (Desktop)](#5-sidebar-navigation-desktop)
6. [Bottom Navigation (Mobile)](#6-bottom-navigation-mobile)
7. [Top Header Bar](#7-top-header-bar)
8. [Journey Map Component](#8-journey-map-component)
9. [Document Verification Notice](#9-document-verification-notice)
10. [Personalized Dashboard Cards](#10-personalized-dashboard-cards)
11. [Notifications Panel](#11-notifications-panel)
12. [Responsive Breakpoints](#12-responsive-breakpoints)
13. [Dark Mode](#13-dark-mode)
14. [Accessibility](#14-accessibility)
15. [Component Tree](#15-component-tree)
16. [Annotated Wireframe (ASCII)](#16-annotated-wireframe-ascii)

---

## 1. Page Architecture

The dashboard is composed of nested layout wrappers:

```
Dashboard (page)
└── DashboardLayoutWithThandi
    └── MobileFriendlyDashboardLayout
        ├── Sidebar (desktop only, collapsible)
        ├── Bottom Nav (mobile only)
        ├── Mobile Menu Overlay (hamburger trigger)
        ├── Top Header Bar
        └── Main Content Area
            └── PageLayout (title + subtitle + gradient header)
                ├── JourneyMap
                ├── DocumentVerificationNotice
                └── PersonalizedDashboard (card grid)
```

---

## 2. Layout System

### Overall Shell

| Property | Value |
|----------|-------|
| Root container | `h-screen flex overflow-hidden` |
| Sidebar width (expanded) | `w-64` (256px) |
| Sidebar width (collapsed) | `w-20` (80px) |
| Sidebar transition | `transition-all duration-300 ease-in-out` |
| Main content bg | `bg-gray-50` (light) / `bg-gray-900` (dark) |
| Content inner bg | `bg-white` (light) / `bg-gray-800` (dark) |
| Content padding | `p-4` (mobile) / `p-6` (sm) / `p-8` (md+) |
| Bottom padding (mobile) | `pb-20` (to clear bottom nav) |
| Bottom padding (desktop) | `pb-10` |

### PageLayout (Inner Content Frame)

| Property | Value |
|----------|-------|
| Max width | `max-w-7xl` |
| Horizontal padding | `px-4` (mobile) / `px-8` (md+) |
| Header section | `py-8 px-4 md:px-8` |
| Header gradient (when enabled) | `bg-gradient-to-r from-primary/5 to-secondary/5` |
| Title font | `text-3xl font-bold tracking-tight` (mobile) / `text-4xl` (md+) |
| Subtitle | `text-lg text-muted-foreground`, `mt-2` below title |

### Dashboard Card Grid

| Property | Value |
|----------|-------|
| Grid layout | `grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Tracking ID card span | `col-span-1 md:col-span-2 lg:col-span-3` (full width) |
| Card shadow | `shadow-md` |
| Card border radius | Inherited from shadcn `Card` → `rounded-lg` (~8px) |

---

## 3. Color System & Design Tokens

### Brand Colors (HSL)

| Token | HSL Values | Hex (approx) | Usage |
|-------|-----------|---------------|-------|
| `--cap-teal` | `174° 68% 41%` | `#21A194` | Primary brand, active nav, buttons, links |
| `--cap-coral` | `12° 88% 59%` | `#E8613C` | Secondary/accent, sparkle icons, highlights |
| `--cap-dark` | `210° 23% 18%` | `#24303D` | Text, dark backgrounds |
| `--cap-light` | `0° 0% 100%` | `#FFFFFF` | Backgrounds, text-on-dark |

### Semantic Status Colors (HSL)

| Token | HSL Values | Hex (approx) | Usage |
|-------|-----------|---------------|-------|
| `--success` | `142° 76% 36%` | `#16A34A` | Verified, completed, approved |
| `--warning` | `43° 96% 48%` | `#EAB308` | Pending, needs attention |
| `--error` | `0° 84% 60%` | `#EF4444` | Rejected, errors |
| `--info` | `217° 91% 60%` | `#3B82F6` | Informational, document updates |

### UI Component Tokens (HSL — used in Tailwind)

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--background` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--foreground` | `222.2 84% 4.9%` | `210 40% 98%` |
| `--card` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--primary` | `174 68% 41%` | `174 68% 41%` |
| `--primary-foreground` | `210 40% 98%` | `222.2 47.4% 11.2%` |
| `--secondary` | `12 88% 59%` | `217.2 32.6% 17.5%` |
| `--muted` | `210 40% 96.1%` | `217.2 32.6% 17.5%` |
| `--muted-foreground` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` |
| `--destructive` | `0 84% 60%` | `0 62.8% 30.6%` |
| `--border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |

### Gradient Definitions

| Name | CSS | Where Used |
|------|-----|-----------|
| Welcome Card | `bg-gradient-to-br from-cap-teal/80 to-blue-300` | Welcome card background |
| Tracking ID Card | `bg-gradient-to-tr from-green-100 to-cap-teal/10` | Tracking ID card |
| Page Header | `bg-gradient-to-r from-primary/5 to-secondary/5` | PageLayout header (optional) |

---

## 4. Typography

| Element | Classes | Rendered Size |
|---------|---------|---------------|
| Page title | `text-3xl font-bold tracking-tight md:text-4xl` | 30px / 36px |
| Page subtitle | `text-lg text-muted-foreground` | 18px |
| Card title (large) | `text-2xl font-semibold` | 24px |
| Card title (standard) | `text-lg font-semibold` | 18px |
| Card description | `CardDescription` (shadcn) | 14px, muted color |
| Body text | `Typography variant="body"` | 16px |
| Tracking ID | `text-2xl font-mono font-bold` | 24px, monospace |
| Nav item (sidebar) | Default (16px) | 16px |
| Mobile nav label | `text-xs` | 12px |
| Journey step label | `text-xs font-medium` | 12px |
| Notification title | `font-medium text-sm` | 14px, semibold |
| Notification body | `text-xs text-gray-600` | 12px |
| Notification timestamp | `text-xs text-gray-500` | 12px |

**Font Stack**: System default (`font-sans` → `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`)

---

## 5. Sidebar Navigation (Desktop)

**Visibility**: Hidden on mobile (`hidden md:block`)

### Expanded State (`w-64`)

```
┌─────────────────────┐
│ [Logo]    [◀ Toggle] │  ← 64px height, border-bottom
├─────────────────────┤
│ 🏠 Dashboard        │  ← Active: bg-cap-teal/10, text-cap-teal
│ 📋 Applications     │  ← Inactive: text-gray-700, hover:bg-gray-100
│ 📖 Programs         │
│ 💼 Career Guidance   │
│ 🎥 Consultations    │
│ 🏢 Sponsorships     │
│ 👤 My Profile       │
├─────────────────────┤
│ 🌙 Dark Mode        │  ← Bottom actions, border-top
│ 🚪 Sign Out         │  ← text-red-600, hover:bg-red-50
└─────────────────────┘
```

### Collapsed State (`w-20`)

- Icons only, centered
- No text labels
- Toggle button shows `ChevronRight`

### Nav Item Styling

| State | Classes |
|-------|---------|
| Default | `text-gray-700 hover:bg-gray-100` |
| Active | `bg-cap-teal/10 text-cap-teal` |
| Dark default | `text-gray-300 hover:bg-gray-800` |
| Dark active | `bg-cap-teal/20 text-cap-teal` |
| Item padding | `px-3 py-3 rounded-lg` |
| Icon size | `h-5 w-5` |
| Text spacing | `ml-3` from icon |

---

## 6. Bottom Navigation (Mobile)

**Visibility**: `md:hidden`, fixed to bottom

```
┌────┬────┬────┬────┬────┐
│ 🏠 │ 📋 │ 📖 │ 💼 │ 🎥 │  ← First 5 nav items only
│Home│Apps│Prog│Care│Cons│
└────┴────┴────┴────┴────┘
```

| Property | Value |
|----------|-------|
| Height | `h-16` (64px) |
| Background | `bg-white` / `bg-gray-900` (dark) |
| Border | `border-t border-gray-200` |
| Z-index | `z-10` |
| Active item color | `text-cap-teal` |
| Inactive | `text-gray-700` |
| Label font | `text-xs` |
| Layout | `flex justify-around items-center` |

---

## 7. Top Header Bar

```
┌──────────────────────────────────────────────┐
│ [☰ mobile] Dashboard          [🔔 2] [👤 email] │
└──────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Height | `h-16` (64px) |
| Background | `bg-white` / `bg-gray-800` (dark) |
| Shadow | `shadow-sm` |
| Padding | `px-4 sm:px-6 lg:px-8` |
| Title font | `text-xl font-semibold text-gray-900` |
| Title max width (mobile) | `max-w-[200px] truncate` |
| Avatar circle | `h-8 w-8 rounded-full bg-cap-teal/20 text-cap-teal` |
| Email text | `text-sm text-gray-600`, hidden below `sm` |
| Hamburger button | `md:hidden`, ghost variant |

### User Avatar (Top Right)

- Circle: `h-8 w-8 rounded-full`
- Background: `bg-cap-teal/20`
- Text: First letter of email, `text-cap-teal`
- Hidden below `sm` breakpoint

---

## 8. Journey Map Component

### Desktop View (`hidden sm:flex`)

A horizontal stepper with connected path line:

```
──●═══════●═══════●═══════◉═══════○═══════○──
  ✓       ✓       ✓      [4]     [5]     [6]
Personal Contact  Address Education Document Review
```

#### Milestone Circle

| Property | Value |
|----------|-------|
| Size | `w-14 h-14` (56px) |
| Shape | `rounded-full` |
| Border | `border-2` |
| Z-index | `z-10` |
| Transition | `transition-all duration-300` |
| Icon size | `w-6 h-6` |
| Cursor | `cursor-pointer` |

#### Milestone Status Colors

| Status | Background | Border | Text/Icon | Extra |
|--------|-----------|--------|-----------|-------|
| **Completed** | `bg-green-600` | `border-green-600` | `text-white` (✓ icon) | — |
| **Active** | `bg-primary` | `border-primary` | `text-white` | `animate-pulse` |
| **Pending** | `bg-gray-100` | `border-gray-300` | `text-gray-400` | — |
| **Error** | `bg-red-50` | `border-red-600` | `text-red-600` | — |

#### Step Number Badge

- Position: `absolute -top-2 -right-2`
- Size: `w-6 h-6 rounded-full`
- Font: `text-xs`
- Not shown for completed milestones
- Active: `bg-primary text-white`
- Pending: `bg-gray-200 text-gray-600`

#### Connection Path

| Property | Value |
|----------|-------|
| Track | `h-0.5 bg-gray-200`, full width |
| Progress fill | `bg-primary`, animated width |
| Position | `absolute top-7` (centered on circles) |
| Transition | `transition-all duration-1000 ease-in-out` |
| Pulse dot | `w-3 h-3 bg-primary animate-ping` at progress end |

#### Milestone Label

- Position: Below circle, `mt-2`
- Font: `text-xs font-medium`
- Max width: `max-w-28` with `text-center whitespace-nowrap`
- Color follows status: primary (active), green-600 (completed), gray-500 (pending)

### Mobile View (`sm:hidden`)

```
┌─────────────────────────────────────┐
│ Step 4 of 6          Education History │
│ [████████████░░░░░░░░░░░░░░░░░░░░░] │
└─────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Label font | `text-sm font-medium text-primary` |
| Track height | `h-2` |
| Track bg | `bg-gray-200 rounded-full` |
| Fill | `bg-primary`, width calculated as `((currentStep + 1) / totalSteps) * 100%` |
| Fill transition | `transition-all duration-500 ease-in-out` |
| Milestone dots | `w-1.5 h-1.5 rounded-full` evenly spaced |

### Journey Steps (6 Total)

| # | Name | Icon | Data Check |
|---|------|------|-----------|
| 1 | Personal Information | `User` | `full_name` + `id_number` in users table |
| 2 | Contact Details | `Phone` | `phone_number` or `contact_email` |
| 3 | Address Information | `MapPin` | Record in `addresses` table |
| 4 | Education History | `BookOpen` | Record in `education_records` table |
| 5 | Document Upload | `FileText` | ≥1 record in `documents` table |
| 6 | Review & Submit | `Award` | ≥1 application with status ≠ 'draft' |

---

## 9. Document Verification Notice

**Conditional**: Only shows when pending or rejected required documents exist.

```
┌─────────────────────────────────────────────┐
│ ⚠️ Document Verification Required            │
│ Please upload and verify required documents  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 📤 ID Document              [Pending]   │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ ⚠️ Academic Transcripts      [Rejected]  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Upload Documents]                          │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Card border | `border-warning-light` |
| Card bg | `bg-warning-light` |
| Title color | `text-warning-dark` |
| Title icon | `AlertTriangle h-5 w-5` |
| Document row bg | `bg-white rounded-lg` |
| Pending row border | `border border-gray-200` |
| Rejected row border | `border border-error-light` |
| Status badge | `StatusBadge` component with semantic variant |
| Upload button | `size="sm" variant="primary"`, bg-warning |
| Margin below | `mb-6` |

### Status Icons

| Status | Icon | Color |
|--------|------|-------|
| Verified | `CheckCircle` | `text-success` |
| Rejected | `AlertTriangle` | `text-error` |
| Pending | `Upload` | `text-warning` |

---

## 10. Personalized Dashboard Cards

### 10a. Tracking ID Card (Full Width)

```
┌──────────────────────────────────────────────┐
│           ✨ Your EduEasy Tracking ID         │
│                                              │
│              [ EDU-ABC123-XYZ ] [📋]          │
│  Use this ID when contacting support...      │
└──────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Span | `col-span-1 md:col-span-2 lg:col-span-3` |
| Background | `bg-gradient-to-tr from-green-100 to-cap-teal/10` |
| Border | `border border-cap-teal` |
| Text color | `text-cap-dark` |
| Sparkles icon | `h-5 w-5 text-cap-coral` |
| Title font | `text-xl font-semibold` |
| ID display | `text-2xl font-mono font-bold` |
| ID container | `bg-white rounded px-3 py-1 border border-cap-coral/40` |
| Copy button | Ghost variant, `hover:text-cap-coral` |
| Margin bottom | `mb-2` |

### 10b. Welcome Card

| Property | Value |
|----------|-------|
| Background | `bg-gradient-to-br from-cap-teal/80 to-blue-300` |
| Text | `text-white` |
| Title | `text-2xl font-semibold` |
| Body text | `text-white/80` |
| Sponsored badge | `Medal h-6 w-6 text-yellow-400` + `text-lg font-semibold text-yellow-100` |
| Upgrade button | `variant="secondary"` with Sparkles icon |

### 10c. Application Status Card

| Property | Value |
|----------|-------|
| Background | Default card (white) |
| Title | `text-lg font-semibold` |
| Empty state | Text + "Start an Application" button |
| Application list | `<ul>` with `mb-2` per item |
| Item format | `{institution_id} - {status}` |

### 10d. Profile Completion Card

| Property | Value |
|----------|-------|
| Background | Default card (white) |
| Title | `text-lg font-semibold` |
| CTA button | "Complete Profile" → navigates to `/profile-completion` |

---

## 11. Notifications Panel

**Trigger**: Bell icon in top header bar

### Bell Icon

| Property | Value |
|----------|-------|
| Icon | `Bell h-5 w-5` |
| Badge position | `absolute -top-1 -right-1` |
| Badge min width | `min-w-[1.2rem] h-5` |
| Badge bg | `bg-error` |
| Badge animation | `animate-pulse` |
| Max display | `99+` |

### Panel (Popover)

| Property | Value |
|----------|-------|
| Width | `w-[360px]` |
| Alignment | `align="end"` |
| Max height | `max-h-[60vh]` (scrollable) |
| Header | Title "Notifications" + "Mark all read" + Filter dropdown |

### Notification Item

| Property | Value |
|----------|-------|
| Unread bg | `bg-blue-50` / `bg-blue-900/20` (dark) |
| Read bg | `bg-white` / `bg-gray-800` (dark) |
| Title | `font-medium text-sm` |
| Message | `text-xs text-gray-600`, `ml-6` |
| Timestamp | `text-xs text-gray-500`, format `MMM d, h:mm a` |
| Delete button | `Trash2 h-3 w-3`, ghost icon button |

### Notification Type Icons

| Type | Icon | Color |
|------|------|-------|
| Document status | `AlertCircle` | `text-blue-600` |
| Application status | `Clock` | `text-green-600` |
| Admin feedback | `MessageSquare` | `text-info` |
| System/default | `Bell` | `text-gray-500` |

### Grouping Options

- **By date**: Today, Yesterday, This Week, This Month, Older
- **By type**: Document Updates, Application Updates, Admin Feedback, System Notifications
- **None**: Flat list

### Filter Options

All, Unread only, Document updates, Application updates, Admin feedback

---

## 12. Responsive Breakpoints

| Breakpoint | Tailwind | Width | Key Changes |
|-----------|----------|-------|-------------|
| Default (mobile) | — | <640px | Bottom nav, progress bar journey, hamburger menu |
| `sm` | `sm:` | ≥640px | Desktop journey map visible, email shown |
| `md` | `md:` | ≥768px | Sidebar visible, bottom nav hidden, 2-col grid |
| `lg` | `lg:` | ≥1024px | 3-col card grid, larger padding |

### Key Responsive Behaviors

1. **Sidebar**: Hidden below `md`, collapsible above `md`
2. **Bottom nav**: Visible below `md` only, shows first 5 items
3. **Journey map**: Progress bar below `sm`, horizontal stepper at `sm+`
4. **Card grid**: 1 col → 2 col (`md`) → 3 col (`lg`)
5. **Header title**: Truncated at `200px` on mobile
6. **User email**: Hidden below `sm`
7. **Content padding**: `p-4` → `p-6` (`sm`) → `p-8` (`md`)

---

## 13. Dark Mode

Toggle via sidebar button (desktop) or header icon (mobile). Uses `class="dark"` strategy.

| Element | Light | Dark |
|---------|-------|------|
| Sidebar bg | `bg-white` | `bg-gray-900` |
| Sidebar border | `border-gray-200` | `border-gray-700` |
| Nav text | `text-gray-700` | `text-gray-300` |
| Nav hover | `hover:bg-gray-100` | `hover:bg-gray-800` |
| Header bg | `bg-white` | `bg-gray-800` |
| Content bg (outer) | `bg-gray-50` | `bg-gray-900` |
| Content bg (inner) | `bg-white` | `bg-gray-800` |
| Content text | `text-gray-900` | `text-gray-100` |
| Card bg | white | `222.2 84% 4.9%` |
| Notification unread | `bg-blue-50` | `bg-blue-900/20` |
| Notification read | `bg-white` | `bg-gray-800` |

---

## 14. Accessibility

| Feature | Implementation |
|---------|---------------|
| Focus rings | `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` |
| Touch targets | Min `44x44px` on all interactive elements |
| Milestone ARIA | `aria-label="{title} - {status}"`, `role="button"`, `tabIndex={0}` |
| Keyboard nav | `onKeyDown` handler for Enter on milestones |
| Reduced motion | Animations disabled via `prefers-reduced-motion: reduce` |
| High contrast | `prefers-contrast: high` → thicker focus rings |
| Screen reader | `sr-only` class for hidden labels |
| Color contrast | WCAG AA compliant semantic tokens |

---

## 15. Component Tree

```
src/
├── pages/
│   └── Dashboard.tsx                          ← Page entry point
├── components/
│   ├── DashboardLayoutWithThandi.tsx           ← Wraps layout + toasters
│   ├── MobileFriendlyDashboardLayout.tsx       ← Shell: sidebar, nav, header
│   ├── layout/
│   │   └── PageLayout.tsx                      ← Title/subtitle/gradient header
│   ├── dashboard/
│   │   ├── PersonalizedDashboard.tsx            ← Card grid (welcome, apps, profile)
│   │   ├── DocumentVerificationNotice.tsx       ← Warning banner for docs
│   │   ├── NotificationsPanel.tsx               ← Bell popover with filters
│   │   └── layout/
│   │       └── DashboardHeader.tsx              ← (Alternate header, not actively used)
│   ├── journey/
│   │   ├── JourneyMap.tsx                       ← Desktop stepper + mobile progress
│   │   ├── JourneyMilestone.tsx                 ← Individual milestone circle
│   │   ├── JourneyPath.tsx                      ← Horizontal connecting line
│   │   └── MilestoneDetail.tsx                  ← Popup detail (on click)
│   ├── user/
│   │   └── PaymentRecoveryNotice.tsx             ← Payment recovery banner
│   ├── Logo.tsx                                  ← Brand logo
│   └── Spinner.tsx                               ← Loading spinner
├── hooks/
│   ├── useApplicationJourneyStep.ts              ← Journey progress from DB
│   ├── useApplications.ts                        ← Application list query
│   ├── useAuth.ts                                ← Auth state (user, signOut)
│   ├── useSubscription.ts                        ← Subscription/tier state
│   ├── useTheme.ts                               ← Dark mode toggle
│   └── useNotificationSystem.ts                  ← Notification CRUD
└── lib/
    ├── design-tokens.ts                          ← Color/spacing constants
    └── utils.ts                                  ← cn() utility
```

---

## 16. Annotated Wireframe (ASCII)

### Desktop (≥768px)

```
┌────────────────┬─────────────────────────────────────────────────┐
│                │  [☰ hidden]  Dashboard        [🔔 3] [👤 email] │
│   [Logo]  [◀]  │─────────────────────────────────────────────────│
│                │                                                 │
│  🏠 Dashboard  │  Dashboard                                     │
│  📋 Apps       │  Welcome back, Student!                         │
│  📖 Programs   │                                                 │
│  💼 Career     │  ──●════●════●════◉════○════○──                │
│  🎥 Consult    │    ✓    ✓    ✓   [4]  [5]  [6]                │
│  🏢 Sponsors   │  Personal Contact Addr Edu  Doc  Review        │
│  👤 Profile    │                                                 │
│                │  ┌─────────────────────────────────────────┐   │
│                │  │ ⚠️ Document Verification Required        │   │
│                │  │ [Upload Documents]                       │   │
│                │  └─────────────────────────────────────────┘   │
│                │                                                 │
│                │  ┌──────────────────────────────────────────┐  │
│                │  │ ✨ Your EduEasy Tracking ID               │  │
│                │  │        [ EDU-ABC123 ] [📋]                │  │
│                │  └──────────────────────────────────────────┘  │
│                │                                                 │
│                │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│                │  │ Welcome  │ │ App      │ │ Complete │       │
│                │  │ Card     │ │ Status   │ │ Profile  │       │
│  🌙 Dark Mode  │  │ (teal    │ │          │ │          │       │
│  🚪 Sign Out   │  │ gradient)│ │          │ │          │       │
│                │  └──────────┘ └──────────┘ └──────────┘       │
└────────────────┴─────────────────────────────────────────────────┘
```

### Mobile (<640px)

```
┌──────────────────────────────┐
│ [☰]  Dashboard    [🔔 3] [🌙]│
├──────────────────────────────┤
│                              │
│  Dashboard                   │
│  Welcome back, Student!      │
│                              │
│  Step 4 of 6    Education    │
│  [████████░░░░░░░░░░░░░░░]   │
│                              │
│  ⚠️ Document Verification    │
│  [Upload Documents]          │
│                              │
│  ┌──────────────────────┐    │
│  │ ✨ Tracking ID       │    │
│  │ [ EDU-ABC123 ] [📋]  │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ Welcome Card         │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ Application Status   │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ Complete Profile     │    │
│  └──────────────────────┘    │
│                              │
├────┬────┬────┬────┬────┤
│ 🏠 │ 📋 │ 📖 │ 💼 │ 🎥 │
│Home│Apps│Prog│Care│Cons│
└────┴────┴────┴────┴────┘
```

---

## Appendix: Icon Library

All icons from **Lucide React** (`lucide-react`):

| Icon | Component | Usage |
|------|-----------|-------|
| Home | `Home` | Dashboard nav |
| ClipboardList | `ClipboardList` | Applications nav |
| BookOpen | `BookOpen` | Programs nav, Education milestone |
| Briefcase | `Briefcase` | Career Guidance nav |
| Video | `Video` | Consultations nav |
| Building | `Building` | Sponsorships nav |
| User | `User` | Profile nav, Personal milestone |
| Bell | `Bell` | Notifications trigger |
| Menu | `Menu` | Mobile hamburger |
| ChevronLeft/Right | `ChevronLeft/Right` | Sidebar toggle |
| Sun / Moon | `Sun` / `Moon` | Theme toggle |
| LogOut | `LogOut` | Sign out |
| Sparkles | `Sparkles` | Upgrade CTA, Tracking ID |
| Copy | `Copy` | Copy tracking ID |
| Medal | `Medal` | Sponsored plan badge |
| AlertTriangle | `AlertTriangle` | Doc verification warning |
| CheckCircle | `CheckCircle` | Verified document |
| Upload | `Upload` | Pending document |
| Phone | `Phone` | Contact milestone |
| MapPin | `MapPin` | Address milestone |
| FileText | `FileText` | Document milestone |
| Award | `Award` | Review milestone |
| CheckIcon | `CheckIcon` | Completed milestone |
| CircleDashed | `CircleDashed` | Default milestone |
| Filter | `Filter` | Notification filter |
| Trash2 | `Trash2` | Delete notification |
| MessageSquare | `MessageSquare` | Admin feedback notification |
| Clock | `Clock` | Application update notification |
| AlertCircle | `AlertCircle` | Document update notification |

---

*Generated: 2026-04-02 | EduEasy Student Dashboard v1.0*

# Student Dashboard Documentation

> **EduEasy Student Dashboard** - Complete Technical & Functional Specification  
> **Last Updated:** 2026-01-03  
> **Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Hooks & State Management](#hooks--state-management)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [Features](#features)
8. [User Journey](#user-journey)
9. [Security & RLS Policies](#security--rls-policies)
10. [API Reference](#api-reference)
11. [UI/UX Guidelines](#uiux-guidelines)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)

---

## Overview

The Student Dashboard is the primary interface for authenticated students in the EduEasy platform. It provides:

- **Application tracking** and status monitoring
- **Document verification** notices and upload prompts
- **Profile completion** guidance
- **Journey progress** visualization
- **Notifications** management
- **Subscription/sponsorship** status display
- **Tracking ID** display and copy functionality

### Entry Point

```
Route: /dashboard
File: src/pages/Dashboard.tsx
```

### Key Technologies

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| TanStack Query | Server State Management |
| Supabase | Backend & Authentication |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| date-fns | Date Formatting |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Dashboard.tsx                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           DashboardLayoutWithThandi                      │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              PageLayout                          │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │            JourneyMap                    │    │    │    │
│  │  │  │  (Progress visualization)                │    │    │    │
│  │  │  └─────────────────────────────────────────┘    │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │    DocumentVerificationNotice            │    │    │    │
│  │  │  │  (Pending/rejected docs warnings)        │    │    │    │
│  │  │  └─────────────────────────────────────────┘    │    │    │
│  │  │  ┌─────────────────────────────────────────┐    │    │    │
│  │  │  │       PersonalizedDashboard              │    │    │    │
│  │  │  │  ┌───────────┬───────────┬──────────┐   │    │    │    │
│  │  │  │  │ Tracking  │ Welcome   │ Profile  │   │    │    │    │
│  │  │  │  │ ID Card   │ Card      │ Card     │   │    │    │    │
│  │  │  │  ├───────────┴───────────┴──────────┤   │    │    │    │
│  │  │  │  │ PaymentRecoveryNotice             │   │    │    │    │
│  │  │  │  │ ApplicationStatusCard             │   │    │    │    │
│  │  │  │  └──────────────────────────────────┘   │    │    │    │
│  │  │  └─────────────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌────────────────┐  ┌────────────────┐                 │    │
│  │  │    Toaster     │  │ SonnerToaster  │                 │    │
│  │  └────────────────┘  └────────────────┘                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Dashboard.tsx (Main Page)

**Location:** `src/pages/Dashboard.tsx`

```typescript
const Dashboard = () => {
  const { user } = useAuth();
  const { applications, loading } = useApplications();
  const { steps, currentStep, loading: journeyLoading } = useApplicationJourneyStep();

  return (
    <DashboardLayoutWithThandi>
      <PageLayout title="Dashboard" subtitle={`Welcome back, ${user?.email?.split('@')[0]}!`}>
        <JourneyMap steps={steps} currentStep={currentStep} />
        <DocumentVerificationNotice />
        <PersonalizedDashboard applications={applications} loading={loading} />
      </PageLayout>
    </DashboardLayoutWithThandi>
  );
};
```

**Props:** None (uses hooks for data)

---

### 2. DashboardLayoutWithThandi

**Location:** `src/components/DashboardLayoutWithThandi.tsx`

Wrapper component that provides:
- Mobile-friendly responsive layout
- Thandi AI assistant integration
- Toast notification containers

```typescript
interface DashboardLayoutWithThandiProps {
  children: ReactNode;
}
```

---

### 3. JourneyMap

**Location:** `src/components/journey/JourneyMap.tsx`

Visual progress indicator showing the 6-step application journey.

```typescript
interface JourneyMapProps {
  steps: string[];      // Array of step labels
  currentStep: number;  // 0-based index of current step
  className?: string;   // Optional CSS classes
}
```

**Journey Steps:**
1. Personal Information
2. Contact Details
3. Address Information
4. Education History
5. Document Upload
6. Review & Submit

**Responsive Behavior:**
- **Desktop:** Horizontal milestone path with connectors
- **Mobile:** Compact progress bar with step counter

---

### 4. DocumentVerificationNotice

**Location:** `src/components/dashboard/DocumentVerificationNotice.tsx`

Displays warnings for pending or rejected documents.

**Document Statuses:**
| Status | Icon | Color | Action |
|--------|------|-------|--------|
| `pending` | Upload | Warning (yellow) | Upload prompt |
| `verified` | CheckCircle | Success (green) | None |
| `rejected` | AlertTriangle | Error (red) | Resubmit prompt |

**Visibility Logic:**
- Only renders if there are pending required docs OR rejected docs
- Returns `null` if all documents are verified

---

### 5. PersonalizedDashboard

**Location:** `src/components/dashboard/PersonalizedDashboard.tsx`

Main dashboard content grid with multiple cards.

```typescript
interface PersonalizedDashboardProps {
  applications: Application[];
  loading: boolean;
}
```

**Cards Included:**

| Card | Description | Span |
|------|-------------|------|
| Tracking ID Card | Displays EDU-ZA-YY-XXXXXX ID with copy button | Full width |
| Payment Recovery Notice | Shows if there's a pending/failed payment | Variable |
| Welcome Card | Personalized greeting with subscription status | 1 column |
| Application Status Card | List of user's applications | 1 column |
| Profile Completion Card | CTA to complete profile | 1 column |

**Sponsor Detection Logic:**
```typescript
const hasSponsorAllocation = sponsorAllocation?.status === 'active';
const isSubscribed = currentSubscription?.is_active || hasSponsorAllocation;
```

---

### 6. NotificationsPanel

**Location:** `src/components/dashboard/NotificationsPanel.tsx`

Popover-based notification center with filtering and grouping.

**Features:**
- Unread count badge (animated pulse)
- Filter by: All, Unread, Document, Application, Admin
- Group by: Date, Type, None
- Mark as read (individual/all)
- Delete notifications

**Notification Types:**
| Type | Icon | Color |
|------|------|-------|
| `document_status` | AlertCircle | Blue |
| `application_status` | Clock | Green |
| `admin_feedback` | MessageSquare | Info |
| `system` | Bell | Gray |

---

## Hooks & State Management

### useAuth

**Location:** `src/hooks/useAuth.ts`

Returns authenticated user context.

```typescript
interface AuthContextType {
  user: User | null;
  userType: string | null;
  isVerified: boolean | null;
  profileStatus: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signUp: (...) => Promise<{ error?: unknown }>;
  signIn: (...) => Promise<{ error?: unknown }>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}
```

---

### useApplications

**Location:** `src/hooks/useApplications.ts`

Fetches user's applications from Supabase.

```typescript
const { applications, loading } = useApplications();

// Returns:
{
  applications: Application[];  // Ordered by created_at DESC
  loading: boolean;
}
```

---

### useApplicationJourneyStep

**Location:** `src/hooks/useApplicationJourneyStep.ts`

Calculates journey progress based on profile completion.

```typescript
const { steps, currentStep, stepStatus, loading } = useApplicationJourneyStep();

// Returns:
{
  steps: string[];              // ["Personal Information", ...]
  currentStep: number;          // First incomplete step index
  stepStatus: (boolean | undefined)[];  // Completion status per step
  loading: boolean;
}
```

**Step Completion Criteria:**

| Step | Table | Condition |
|------|-------|-----------|
| 0 - Personal Info | `users` | `full_name` AND `id_number` present |
| 1 - Contact Details | `users` | `phone_number` OR `contact_email` present |
| 2 - Address | `addresses` | At least one address record exists |
| 3 - Education | `education_records` | At least one record exists |
| 4 - Documents | `documents` | At least one document uploaded |
| 5 - Submit | `applications` | At least one non-draft application |

---

### useSubscription

**Location:** `src/hooks/useSubscription.ts`

Manages subscription state.

```typescript
const { currentSubscription } = useSubscription();

// Returns subscription with is_active flag
```

---

### useNotificationSystem

**Location:** `src/hooks/useNotificationSystem.ts`

Real-time notification management.

```typescript
interface NotificationSystemReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllReadNotifications: () => void;
}
```

---

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Supabase   │────▶│    Hooks     │────▶│  Components  │
│   Database   │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │              useApplications            │
       │              useAuth                    │
       │              useSubscription            │
       │              useApplicationJourneyStep  │
       │              useNotificationSystem      │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────┐
│                     User Interface                        │
│  - JourneyMap (progress visualization)                   │
│  - DocumentVerificationNotice (action items)             │
│  - PersonalizedDashboard (status cards)                  │
│  - NotificationsPanel (real-time updates)                │
└──────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Tables Used by Dashboard

#### `users`
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  id_number TEXT,
  phone_number TEXT,
  contact_email TEXT,
  tracking_id TEXT UNIQUE,      -- Format: EDU-ZA-YY-XXXXXX
  current_plan TEXT,
  user_type TEXT,               -- 'student', 'sponsor', etc.
  profile_status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### `applications`
```sql
CREATE TABLE public.applications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  institution_id UUID,
  program_id UUID,
  status TEXT,                  -- 'draft', 'submitted', 'approved', etc.
  created_at TIMESTAMPTZ
);
```

#### `documents`
```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY,
  user_id UUID,
  application_id UUID,
  document_type TEXT,
  file_path TEXT,
  verification_status TEXT,     -- 'pending', 'verified', 'rejected'
  rejection_reason TEXT,
  created_at TIMESTAMPTZ
);
```

#### `addresses`
```sql
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY,
  user_id UUID,
  address_type TEXT,
  street_address TEXT,
  suburb TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT
);
```

#### `education_records`
```sql
CREATE TABLE public.education_records (
  id UUID PRIMARY KEY,
  user_id UUID,
  school_name TEXT,
  province TEXT,
  completion_year INTEGER
);
```

#### `notifications`
```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY,
  user_id UUID,
  title TEXT,
  message TEXT,
  notification_type TEXT,       -- 'document_status', 'application_status', etc.
  is_read BOOLEAN DEFAULT false,
  related_document_id UUID,
  created_at TIMESTAMPTZ
);
```

#### `sponsor_allocations`
```sql
CREATE TABLE public.sponsor_allocations (
  id UUID PRIMARY KEY,
  student_id UUID,
  sponsor_id UUID,
  plan TEXT,
  status TEXT,                  -- 'active', 'expired', etc.
  allocated_on TIMESTAMPTZ,
  expires_on TIMESTAMPTZ
);
```

---

## Features

### 1. Tracking ID System

**Format:** `EDU-ZA-YY-XXXXXX`
- `EDU-ZA` - Platform prefix
- `YY` - Year (2-digit)
- `XXXXXX` - Sequential 6-digit number

**Generation:** Via `generate_tracking_id()` PostgreSQL function using sequence.

**Display:** 
- Full-width card at top of dashboard
- Copy-to-clipboard functionality
- Masked display for security in some contexts

---

### 2. Application Journey Progress

**6-Step Journey:**
1. ✅ Personal Information → `users.full_name` + `users.id_number`
2. ✅ Contact Details → `users.phone_number` OR `users.contact_email`
3. ✅ Address Information → `addresses` record exists
4. ✅ Education History → `education_records` record exists
5. ✅ Document Upload → `documents` record exists
6. ✅ Review & Submit → `applications.status !== 'draft'`

**Visual States:**
- **Completed:** Green checkmark
- **Active:** Blue pulsing indicator
- **Pending:** Gray circle

---

### 3. Document Verification Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│   Pending   │────▶│  Verified   │
│  Document   │     │  (Yellow)   │     │  (Green)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Rejected   │
                    │   (Red)     │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Resubmit   │
                    └─────────────┘
```

**Notification Trigger:** `create_document_notification()` fires on status change.

---

### 4. Subscription & Sponsorship

**Access Levels:**
| Plan | Features |
|------|----------|
| `free` / `starter` | Basic access |
| `pro` | Premium features |
| `sponsored` | Sponsor-funded premium |

**Detection Logic:**
```typescript
const isSubscribed = currentSubscription?.is_active || hasSponsorAllocation;
```

**Sponsored Visual:**
- Gold medal icon 🏅
- "Sponsored Plan Active" badge
- Thank sponsor messaging

---

### 5. Real-Time Notifications

**Types:**
- `document_status` - Document verification updates
- `application_status` - Application state changes
- `admin_feedback` - Admin messages
- `system` - System announcements

**Grouping Options:**
- By Date (Today, Yesterday, This Week, This Month, Older)
- By Type (Document Updates, Application Updates, etc.)
- No grouping

---

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENT DASHBOARD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LOGIN                                                        │
│     └──▶ Auth check via useAuth()                               │
│                                                                  │
│  2. LOAD DASHBOARD                                               │
│     ├──▶ Fetch applications (useApplications)                   │
│     ├──▶ Calculate journey step (useApplicationJourneyStep)     │
│     ├──▶ Load subscription status (useSubscription)             │
│     └──▶ Fetch notifications (useNotificationSystem)            │
│                                                                  │
│  3. DISPLAY COMPONENTS                                           │
│     ├──▶ JourneyMap (progress indicator)                        │
│     ├──▶ DocumentVerificationNotice (if pending/rejected docs)  │
│     └──▶ PersonalizedDashboard (main content)                   │
│                                                                  │
│  4. USER ACTIONS                                                 │
│     ├──▶ Copy Tracking ID                                        │
│     ├──▶ Start/Continue Application                             │
│     ├──▶ Complete Profile                                        │
│     ├──▶ Upload Documents                                        │
│     ├──▶ View Notifications                                      │
│     └──▶ Upgrade Subscription                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security & RLS Policies

### Row Level Security

All dashboard tables have RLS enabled with user-scoped policies:

```sql
-- Users can only view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only view their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only view their own documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
```

### Authentication Guard

Dashboard requires authenticated user:
```typescript
const { user } = useAuth();
if (!user) {
  // Redirect to login
}
```

---

## API Reference

### Supabase Queries Used

#### Fetch User Profile
```typescript
const { data } = await supabase
  .from('users')
  .select('full_name, id_number, phone_number, contact_email, tracking_id')
  .eq('id', user.id)
  .single();
```

#### Fetch Applications
```typescript
const { data } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

#### Fetch Sponsor Allocation
```typescript
const { data } = await supabase
  .from('sponsor_allocations')
  .select('*')
  .eq('student_id', userId)
  .eq('sponsor_id', sponsorId)
  .eq('status', 'active')
  .maybeSingle();
```

#### Check Address Exists
```typescript
const { data } = await supabase
  .from('addresses')
  .select('id')
  .eq('user_id', user.id)
  .maybeSingle();
```

#### Check Education Exists
```typescript
const { data } = await supabase
  .from('education_records')
  .select('id')
  .eq('user_id', user.id)
  .maybeSingle();
```

#### Fetch Documents
```typescript
const { data } = await supabase
  .from('documents')
  .select('id')
  .eq('user_id', user.id);
```

---

## UI/UX Guidelines

### Color Tokens

| Token | Usage |
|-------|-------|
| `cap-teal` | Primary accent, welcome card gradient |
| `cap-coral` | Secondary accent, tracking ID highlight |
| `cap-dark` | Dark text |
| `success` | Verified status |
| `warning` | Pending status |
| `error` | Rejected status |

### Spacing

- Card padding: `p-4` to `p-6`
- Card gaps: `gap-4`
- Section margins: `mb-6` to `mb-8`

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| Mobile (`< sm`) | Single column, compact journey bar |
| Tablet (`sm-md`) | 2-column grid |
| Desktop (`lg+`) | 3-column grid, full journey map |

### Animations

- Notification badge: `animate-pulse` on unread
- Card transitions: `transition-colors duration-200`
- Progress bar: `transition-all duration-500 ease-in-out`

---

## Testing

### Unit Tests

```typescript
// Test journey step calculation
describe('useApplicationJourneyStep', () => {
  it('should return step 0 when no profile data', () => {
    const { result } = renderHook(() => useApplicationJourneyStep());
    expect(result.current.currentStep).toBe(0);
  });

  it('should advance step when personal info complete', async () => {
    // Mock user with full_name and id_number
    const { result } = renderHook(() => useApplicationJourneyStep());
    await waitFor(() => {
      expect(result.current.currentStep).toBeGreaterThan(0);
    });
  });
});
```

### E2E Tests

```typescript
describe('Student Dashboard', () => {
  beforeEach(() => {
    cy.login('student@test.com', 'password');
    cy.visit('/dashboard');
  });

  it('displays tracking ID card', () => {
    cy.get('[data-testid="tracking-id-card"]').should('be.visible');
  });

  it('displays journey progress', () => {
    cy.get('[data-testid="journey-map"]').should('be.visible');
  });

  it('can copy tracking ID', () => {
    cy.get('[data-testid="copy-tracking-id"]').click();
    cy.get('.toast').should('contain', 'Copied');
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Dashboard Not Loading
**Symptoms:** Blank page, infinite loading
**Causes:**
- Auth session expired
- RLS policy blocking data
- Network error

**Solution:**
```typescript
// Check auth state
const { user, loading } = useAuth();
if (!user && !loading) {
  navigate('/login');
}
```

#### 2. Tracking ID Not Showing
**Symptoms:** Tracking ID card not visible
**Causes:**
- User profile not yet created in `users` table
- Tracking ID not assigned

**Solution:**
```sql
-- Assign tracking ID manually
SELECT assign_tracking_id_to_user('user-uuid-here');
```

#### 3. Journey Step Not Advancing
**Symptoms:** Step shows 0 despite completing profile
**Causes:**
- Data not saved to correct table
- Query caching

**Solution:**
- Verify data exists in relevant tables
- Refresh page or invalidate query cache

#### 4. Notifications Not Updating
**Symptoms:** Real-time notifications not appearing
**Causes:**
- Realtime subscription not active
- RLS policy blocking insert trigger

**Solution:**
- Check Supabase realtime status
- Verify RLS allows notification inserts

---

## Changelog

### v1.0.0 (2026-01-03)
- Initial documentation
- Complete component inventory
- Database schema reference
- Security & RLS documentation

---

## Related Documentation

- [Authentication Flow](./AUTHENTICATION.md)
- [Application Form](./APPLICATION_FORM.md)
- [Document Upload](./DOCUMENT_UPLOAD.md)
- [Subscription Management](./SUBSCRIPTION.md)
- [Thandi AI Assistant](./THANDI_AI.md)

---

> **Note:** This documentation is auto-generated from codebase analysis and should be kept in sync with code changes.

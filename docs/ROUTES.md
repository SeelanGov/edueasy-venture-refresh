# Route Architecture Documentation

## Overview
This document outlines the route structure, access levels, and purpose for each route in the EduEasy application.

## Route Categories

### PUBLIC Routes
Routes accessible to all users without authentication.

| Route | Component | Purpose | Access Level |
|-------|-----------|---------|--------------|
| `/` | `Index` | Landing page/homepage | PUBLIC |
| `/home` | `Index` | Alternative homepage route | PUBLIC |
| `/login` | `Login` | User authentication | PUBLIC |
| `/register` | `Register` | User registration | PUBLIC |
| `/pricing` | `Pricing` | Pricing information | PUBLIC |
| `/meet-thandi` | `MeetThandi` | AI assistant introduction | PUBLIC |
| `/institutions` | `Institutions` | Institution listings | PUBLIC |
| `/institutions/:id` | `InstitutionDetail` | Institution details | PUBLIC |
| `/partner-inquiry` | `PartnerInquiry` | Partner inquiry form | PUBLIC |
| `/faqs` | `FAQPage` | Frequently asked questions | PUBLIC |
| `/sponsorships` | `SponsorshipsPage` | Sponsorship information | PUBLIC |
| `/checkout` | `CheckoutPage` | Payment processing | PUBLIC |
| `/career-guidance` | `CareerGuidancePage` | Career guidance content | PUBLIC |
| `/consultations` | `ConsultationsPage` | Consultation booking | PUBLIC |
| `/privacy-policy` | `PrivacyPolicy` | Privacy policy | PUBLIC |
| `/terms-of-service` | `TermsOfService` | Terms of service | PUBLIC |
| `/refund-policy` | `RefundPolicy` | Refund policy | PUBLIC |
| `/sponsors/register` | `SponsorRegister` | Sponsor registration | PUBLIC |
| `/sponsors/login` | `SponsorLogin` | Sponsor login | PUBLIC |
| `/nsfas/login` | `NSFASLogin` | NSFAS login | PUBLIC |
| `/institutions/login` | `InstitutionLogin` | Institution login | PUBLIC |
| `/counselors/login` | `CounselorLogin` | Counselor login | PUBLIC |
| `/students/login` | `StudentLogin` | Student login | PUBLIC |
| `/institutions/register` | `InstitutionRegister` | Institution registration | PUBLIC |
| `/nsfas/register` | `NSFASRegister` | NSFAS registration | PUBLIC |
| `/counselors/register` | `CounselorRegister` | Counselor registration | PUBLIC |
| `/sponsorships/apply` | `ApplyForSponsorship` | Sponsorship application | PUBLIC |
| `/sponsorships/status` | `StudentSponsorshipStatus` | Sponsorship status | PUBLIC |
| `/verification-required` | `VerificationRequired` | Verification notice | PUBLIC |
| `/unauthorized` | `Unauthorized` | Access denied page | PUBLIC |

### AUTHENTICATED Routes
Routes requiring user authentication.

| Route | Component | Purpose | Access Level |
|-------|-----------|---------|--------------|
| `/auth-redirect` | `RoleBasedRedirect` | Post-login role-based routing | AUTH_REQUIRED |
| `/dashboard` | `Dashboard` | Main user dashboard | AUTH_REQUIRED |
| `/profile-demo` | `ProfileDemo` | Profile demonstration | AUTH_REQUIRED |
| `/profile-completion` | `ProfileCompletion` | Profile completion flow | AUTH_REQUIRED |
| `/subscription` | `SubscriptionPage` | Subscription management | AUTH_REQUIRED |
| `/apply` | `ApplicationForm` | Application submission | AUTH_REQUIRED |

### ROLE_SPECIFIC Routes
Routes requiring specific user roles.

| Route | Component | Purpose | Access Level |
|-------|-----------|---------|--------------|
| `/sponsors/dashboard` | `SponsorDashboard` | Sponsor dashboard | SPONSOR |
| `/institutions/dashboard` | `InstitutionDashboard` | Institution dashboard | INSTITUTION |
| `/partner-dashboard` | `PartnerDashboard` | Partner dashboard | ADMIN |
| `/admin/ui-lock` | `UILockAdmin` | UI lock management | ADMIN |
| `/admin/partners` | `PartnersPage` | Partner management | ADMIN |
| `/admin/partners/:id` | `PartnerProfilePage` | Partner profile | ADMIN |
| `/admin/partners-old` | `PartnerCRMLayout` | Legacy partner CRM | ADMIN |
| `/admin/dashboard` | `AdminDashboard` | Admin dashboard | ADMIN |
| `/admin/sponsors` | `SponsorsPage` | Sponsor management | ADMIN |
| `/admin/sponsors/:id` | `SponsorProfile` | Sponsor profile | ADMIN |
| `/admin/users` | `UserManagement` | User management | ADMIN |

### REDIRECT_ONLY Routes
Routes that only perform redirects.

| Route | Component | Purpose | Access Level |
|-------|-----------|---------|--------------|
| `/auth-redirect` | `RoleBasedRedirect` | Post-login routing | AUTH_REQUIRED |

## Route Guards

### AuthGuard
- **Purpose**: Ensures user authentication
- **Usage**: Wraps authenticated routes
- **Behavior**: Redirects to `/login` if not authenticated

### VerificationGuard
- **Purpose**: Ensures user verification
- **Usage**: Wraps routes requiring verification
- **Behavior**: Redirects to `/verification-required` if not verified

### AdminAuthGuard
- **Purpose**: Ensures admin privileges
- **Usage**: Wraps admin routes
- **Behavior**: Redirects to `/unauthorized` if not admin

### SponsorGuard
- **Purpose**: Ensures sponsor privileges
- **Usage**: Wraps sponsor routes
- **Behavior**: Redirects to `/unauthorized` if not sponsor

### InstitutionGuard
- **Purpose**: Ensures institution privileges
- **Usage**: Wraps institution routes
- **Behavior**: Redirects to `/unauthorized` if not institution

## Route Change Guidelines

### Before Making Route Changes
1. **Document the change** in this file
2. **Test both authenticated and unauthenticated access**
3. **Update any hardcoded redirects**
4. **Verify role-based access controls**
5. **Check for broken links or references**

### Route Naming Conventions
- Use explicit names: `/auth-redirect` instead of `/`
- Separate public from authenticated routes
- Use clear patterns: `/public/*`, `/auth/*`, `/admin/*`
- Avoid generic paths for specific functions

### Testing Checklist
- [ ] Unauthenticated access works correctly
- [ ] Authenticated access works correctly
- [ ] Role-based redirects work correctly
- [ ] All partner registration flows work
- [ ] No broken links or references
- [ ] SEO meta tags are preserved
- [ ] Social sharing works correctly

## Security Considerations

### Public Routes
- Must not contain sensitive information
- Should not require authentication
- Must be accessible to search engines

### Protected Routes
- Must be wrapped with appropriate guards
- Should redirect unauthenticated users
- Must validate user permissions

### Redirect Routes
- Should be temporary and not bookmarkable
- Must handle edge cases (no user, no role, etc.)
- Should provide appropriate loading states

## Recent Changes (2025-01-15)

### Fixed Issues
- **Root Route Problem**: Changed `/` from `RoleBasedRedirect` to `Index` (homepage)
- **Authentication Flow**: Created `/auth-redirect` for post-login routing
- **Role-Based Redirects**: Updated all login success handlers to use `/auth-redirect`
- **Component Updates**: Enhanced `RoleBasedRedirect` to handle unauthenticated users

### Benefits
- **SEO Improvement**: Homepage now accessible to search engines
- **User Experience**: Clear separation between public and authenticated areas
- **Security**: Proper role-based access controls maintained
- **Maintainability**: Clear route documentation and testing framework 
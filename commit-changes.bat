@echo off
echo Staging changes...
git add src/components/NetworkErrorHandler.tsx
git add src/components/dashboard/DocumentVerificationNotice.tsx
git add src/components/auth/RegisterHeader.tsx
git add src/components/Logo.tsx
git add src/components/career-guidance/CareerAssessmentCard.tsx
git add src/components/footer.tsx
git add src/components/home/Footer.tsx
git add src/components/home/PartnersSection.tsx
git add src/components/Navbar.tsx
git add src/pages/Login.tsx
git add src/pages/ForgotPassword.tsx
git add src/pages/ResetPassword.tsx
git add src/pages/ProfileCompletion.tsx
git add src/pages/AdminAnalytics.tsx
echo Committing changes...
git commit -m "Fix TypeScript errors in React components

- Fixed return statements in useEffect callbacks
- Removed unused React imports
- Fixed import order and structure
- Added proper default export for Logo component
- Fixed type definitions and function signatures
- Updated Logo component usage in Footer
- Fixed PatternBorder import in PartnersSection, Login, ForgotPassword, ResetPassword, and ProfileCompletion
- Added named export for Navbar component
- Fixed AnalyticsFilters component import in AdminAnalytics"
echo Done!
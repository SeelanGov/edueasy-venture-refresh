# Developer & Support Onboarding

## Getting Started

1. Clone the repository from GitHub.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required environment variables (see below).
4. Run the development server: `npm run dev`

## Project Structure

- `src/`: Main source code (components, hooks, utils, etc.)
- `docs/`: Documentation (security, database, onboarding, API)
- `supabase/`: Supabase config, migrations, and functions
- `public/`: Static assets

## Environment Variables

- See `.env.example` for all required variables (Supabase keys, API endpoints, etc.)
- For production, use a secrets manager (GitHub Actions, AWS Secrets Manager, etc.)

## Common Scripts

- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm test` — Run tests

## Troubleshooting

- See `docs/security.md` and `docs/database.md` for backend/RLS issues
- For support tools and admin dashboard, see `src/components/admin/` and `src/components/support/`

## Support Staff Guide

- Use the admin dashboard for application management, error logs, and notifications
- Access the FAQ and help widget for user support

# Deployment, CI/CD, and DevOps

## Automated Deployment

- Scripts for staging and production deployment are in `scripts/`.
- Use `scripts/deploy-staging.ps1` and `scripts/deploy-production.ps1` for Windows/PowerShell.
- Each script runs build, test, and deploy steps.

## Environment Variables & Secrets

- Local: Use `.env` file (never commit secrets to git)
- CI/CD: Use environment variables and a secrets manager (GitHub Actions, AWS, etc.)
- Rotate secrets regularly and document the process in this file.

## Rollback & Backup

- Rollback: Use `git revert` for code, and Supabase migration rollback for database.
- Backups: Enable automated database backups in Supabase or your cloud provider.
- Restore: Document the restore process and test regularly.

## Additional Notes

- See `docs/onboarding.md` for onboarding and troubleshooting.
- See `docs/security.md` for RLS and security policies.

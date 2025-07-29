# Phase 1: Git History Cleanup Runbook

## Introduction

### Purpose

This runbook provides step-by-step instructions for scrubbing sensitive `.env` files from the
EduEasy project's git history and rotating exposed Supabase credentials. This procedure aligns with
our [Security Policy](../README.md#security) and ensures comprehensive protection of our
authentication system.

### Critical Nature

Scrubbing `.env` history is essential because:

- **Exposed Supabase Credentials**: Anon keys and service role keys may have been committed to
  history
- **Security Vulnerability**: Historical commits can be accessed by anyone with repository access
- **Compliance Requirements**: POPIA compliance demands proper handling of sensitive data
- **Production Safety**: Prevents unauthorized access to our Supabase backend

### Context

EduEasy relies heavily on Supabase for authentication, database operations, and edge functions. Our
`.env` file contains critical credentials including:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY`

## Prerequisites

### Required Tools

Ensure you have the following tools installed with minimum versions:

- **git-filter-repo ≥ 2.34.0**: Primary tool for history rewriting
  ```bash
  pip install git-filter-repo
  ```
- **GitHub CLI**: For managing secrets and repository operations
  ```bash
  # Install via your package manager or download from github.com/cli/cli
  gh --version
  ```
- **Node.js ≥ 18.x**: Required for project builds and testing
  ```bash
  node --version
  ```

### Environment Checklist

Before proceeding, verify:

- [ ] Fresh clone of the repository (no uncommitted changes)
- [ ] All team members notified of upcoming history rewrite
- [ ] Backup of current repository state created
- [ ] Access to Supabase dashboard with admin privileges
- [ ] GitHub repository admin access for secrets management

### Point of Contact

**Primary Contact**: Development Team Lead  
**Role**: Repository Administrator  
**Escalation**: Technical Director

⚠️ **Warning**: This process rewrites git history and cannot be undone easily. Ensure all team
members are coordinated before proceeding.

## History Scrub Steps

### 1. Create Backup Branch

Create a timestamped backup branch before making any changes:

```bash
git checkout main
git branch backup/pre-history-scrub-$(date +%Y%m%d)
git push origin backup/pre-history-scrub-$(date +%Y%m%d)
```

### 2. Filter Execution

⚠️ **Destructive Operation**: This command permanently removes `.env` from all git history.

```bash
git filter-repo --invert-paths --path .env
```

### 3. Team Coordination & Force Push

**Before Force Pushing:**

1. Notify all team members via Slack/email
2. Ensure no one is actively working on the repository
3. Schedule a maintenance window if necessary

**Force Push Procedure:**

```bash
git push origin --force --all
git push origin --force --tags
```

**Notification Template:**

```
🚨 MAINTENANCE ALERT 🚨
Repository: EduEasy
Action: Git history cleanup in progress
Duration: ~30 minutes
Impact: All local clones will need to be refreshed
Next Steps: Fresh clone required after completion
```

### 4. Verification Commands

Verify the `.env` file has been completely removed from history:

```bash
# Check if .env appears in any commit
git log --all -- .env

# Search for any .env references in the repository
grep -R "\.env" .

# Verify file doesn't exist in any branch
git ls-files | grep -E "\.env$"
```

Expected results:

- `git log --all -- .env` should return no results
- `grep -R "\.env"` should only show references in documentation or scripts
- `git ls-files | grep -E "\.env$"` should return no results

## Key Rotation Instructions

### Supabase Dashboard Steps

1. **Access Supabase Dashboard**
   - Navigate to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select the EduEasy project (`pensvamtfjtpsaoeflbx`)

2. **Rotate Anonymous Key**
   - Go to Settings → API
   - Click "Generate new anon key"
   - Copy the new key immediately
   - Save in secure location (vault/secret manager)

3. **Rotate Service Role Key**
   - In the same API settings page
   - Click "Generate new service_role key"
   - Copy the new key immediately
   - Save in secure location (vault/secret manager)

4. **Update Project URL** (if needed)
   - Verify the project URL hasn't changed
   - Current URL: `https://pensvamtfjtpsaoeflbx.supabase.co`

### Best Practices for Key Storage

- **Use a Secret Manager**: Store keys in HashiCorp Vault, AWS Secrets Manager, or similar
- **Limit Access**: Only authorized team members should have access
- **Document Rotation**: Log when keys were rotated and by whom
- **Test New Keys**: Verify functionality before widespread deployment

### Integration with .env.example

Update the `.env.example` file to reflect any new variable names or structure:

```bash
# Verify current structure matches new keys
cat .env.example
```

## GitHub Secrets Update

### Web UI Method

1. Navigate to repository Settings → Secrets and variables → Actions
2. Update the following secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Click "Update secret" for each entry

### CLI Method

```bash
# Set Supabase URL
gh secret set VITE_SUPABASE_URL --body "https://pensvamtfjtpsaoeflbx.supabase.co"

# Set new anonymous key
gh secret set VITE_SUPABASE_ANON_KEY --body "your-new-anon-key-here"

# Set new service role key
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-new-service-role-key-here"
```

### CI/CD Integration

Verify secrets are properly mapped in `.github/workflows/ci-cd.yml`:

```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

### Masked Logging Confirmation

Test that secrets are never printed in GitHub Actions logs:

1. Trigger a workflow run
2. Check Actions logs for any exposed credentials
3. Verify all sensitive values show as `***`

## Verification & Cleanup

### Fresh Clone Test

Perform a complete fresh clone test to ensure everything works:

```bash
# Clone the repository fresh
git clone https://github.com/SeelanGov/edueasy-venture-refresh.git test-clone
# Note: The 'edueasy-venture-refresh' folder and submodule have been removed from the active codebase. Any references are now only historical or in documentation.
cd test-clone

# Install dependencies
bun install

# Run linting
bun run lint

# Run security checks
bun run check-env

# Build the project
bun run build
```

### Global Grep for .env References

Search for any remaining `.env` references that might cause issues:

```bash
# Search entire codebase
grep -r "\.env" . --exclude-dir=node_modules --exclude-dir=.git

# Check for environment variable loading patterns
grep -r "dotenv" . --exclude-dir=node_modules --exclude-dir=.git
```

### Cache and Fork Cleanup

Clean up local development environment:

```bash
# Clear git cache
git gc --aggressive --prune=now

# Remove local .env if it exists
rm -f .env

# Clear node modules and reinstall
rm -rf node_modules
bun install
```

**Fork Cleanup Instructions:**

- Notify team members to delete and re-fork the repository
- Update any CI/CD pipelines that reference the old history
- Clear any cached builds or deployments

## Rollback Procedures

### Backup Branch Restore

If issues arise, restore from the backup branch:

```bash
# Switch to backup branch
git checkout backup/pre-history-scrub-$(date +%Y%m%d)

# Create new main branch from backup
git checkout -b main-restored
git push origin main-restored

# Force update main (use with extreme caution)
git checkout main
git reset --hard backup/pre-history-scrub-$(date +%Y%m%d)
git push origin main --force
```

### Reflog Recovery

For more complex recovery scenarios:

```bash
# View recent repository state changes
git reflog

# Restore to specific reflog entry
git reset --hard HEAD@{n}  # Replace n with appropriate entry number
```

### Communication Template for Rollback

```
🔄 ROLLBACK IN PROGRESS 🔄
Repository: EduEasy
Issue: [Brief description of problem]
Action: Restoring from backup branch
ETA: [Estimated completion time]
Impact: Development work may be temporarily affected
Status Updates: Will be provided every 15 minutes
```

## Post-Cleanup Checklist

### Verification Tasks

- [ ] CI pipeline passing on main branch
- [ ] All GitHub Actions workflows executing successfully
- [ ] Fresh clone builds and runs correctly
- [ ] Environment variables properly configured
- [ ] No `.env` references in git history
- [ ] Supabase connection working with new credentials
- [ ] All team members notified of completion

### Team Notification

**Completion Message Template:**

```
✅ GIT HISTORY CLEANUP COMPLETE ✅

Repository: EduEasy
Status: Successfully completed Phase 1 cleanup
Actions Required:
1. Delete your local clone
2. Fresh clone the repository
3. Set up local .env with new credentials
4. Run `bun install && bun run dev` to verify setup

New Supabase credentials have been rotated and are available in:
- GitHub Secrets (for CI/CD)
- [Your secret manager] (for local development)

Questions? Contact: [Development Team Lead]
```

### Monitoring

Set up monitoring for:

- [ ] Supabase access logs for unusual activity
- [ ] GitHub Actions success rates
- [ ] Application error rates post-deployment
- [ ] Authentication flow integrity

### Point of Contact

**Primary Contact**: Development Team Lead  
**Email**: [team-lead-email]  
**Slack**: @teamlead  
**Escalation Path**: Technical Director → CTO

**For Issues Related To:**

- Git history problems: Development Team Lead
- Supabase access issues: Backend Team Lead
- CI/CD pipeline failures: DevOps Engineer
- Security concerns: Security Officer

---

⚠️ **Remember**: This runbook should be executed during a planned maintenance window with full team
coordination. Keep this document updated as our infrastructure evolves.

# CI/CD Setup Guide for EduEasy

This document provides instructions for setting up the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the EduEasy project.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and consists of the following stages:
1. Build and Test
2. (Optional) Deployment to staging and production environments

## Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

1. A GitHub account with access to the repository
2. (Optional) Staging and production servers with SSH access

## Setting Up GitHub Secrets

The CI/CD pipeline relies on several secrets that need to be configured in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add the following secrets:

### Build Environment Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### (Optional) Deployment Secrets

If you want to enable automatic deployment, add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DEPLOY_SSH_KEY` | Your SSH private key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `STAGING_SERVER_IP` | IP address of your staging server | `192.168.1.100` |
| `STAGING_SERVER_USER` | SSH username for staging server | `deploy` |
| `STAGING_SERVER_PATH` | Path to deploy to on staging server | `/var/www/edueasy-staging` |
| `PRODUCTION_SERVER_IP` | IP address of your production server | `192.168.1.200` |
| `PRODUCTION_SERVER_USER` | SSH username for production server | `deploy` |
| `PRODUCTION_SERVER_PATH` | Path to deploy to on production server | `/var/www/edueasy` |

## Workflow Configuration

The CI/CD workflow is defined in `.github/workflows/ci-cd.yml`. The workflow:

1. Builds and tests the application on every push and pull request to the main branch
2. (When configured) Deploys to staging and production environments

### Key Features

The workflow includes several important features:

1. **Concurrency Control**: Prevents multiple deployments from running simultaneously
2. **Timeout Settings**: Prevents jobs from running indefinitely if something goes wrong
3. **Fallback Mechanisms**: Multiple build strategies to handle different scenarios

## Verifying the CI/CD Setup

You can verify that your CI/CD setup is complete and correctly configured by running:

```sh
npm run ci:verify-setup
```
This npm script runs `node scripts/verify-ci-cd-setup.js` to check that required files and workflows are properly configured.

This script checks:
- All required files are present
- All required npm scripts are defined
- The GitHub workflow contains all necessary jobs

## Manual Deployment

You can also deploy manually using the provided scripts:

```sh
# Deploy to staging
npm run deploy:staging
# Or with parameters
./scripts/deploy-staging.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy-staging

# Deploy to production
npm run deploy:production
# Or with parameters
./scripts/deploy-production.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy
```

## Checking CI/CD Status

You can check the status of your CI/CD pipeline using:

```sh
npm run ci:status
```

This will show the status of recent workflow runs.

## Troubleshooting

### Common Issues

#### Build Failures

If the build fails, check:
- GitHub Actions logs for specific error messages
- Ensure all required environment variables are set
- Check for Rollup dependency issues (the workflow includes special handling for this)

#### Deployment Failures

If deployment fails, check:
- SSH key is correctly set up in GitHub Secrets
- Server IP, username, and path are correctly configured
- The deployment user has write permissions to the target directory

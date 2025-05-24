# EduEasy - Educational Platform

[![CI/CD](https://github.com/SeelanGov/edueasy-venture-refresh/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/SeelanGov/edueasy-venture-refresh/actions/workflows/ci-cd.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Project info

**Production URL**: https://edueasy.com
**Staging URL**: https://staging.edueasy.com
**Development URL**: https://lovable.dev/projects/f1e7aa7c-0ce5-4a8a-9e5d-737a10658e28

## Deployment Status

| Environment | Status |
|-------------|--------|
| Production  | [![Production Deployment](https://github.com/SeelanGov/edueasy-venture-refresh/workflows/CI/CD/badge.svg?branch=main)](https://github.com/SeelanGov/edueasy-venture-refresh/actions) |
| Staging     | [![Staging Deployment](https://github.com/SeelanGov/edueasy-venture-refresh/workflows/CI/CD/badge.svg?branch=main)](https://github.com/SeelanGov/edueasy-venture-refresh/actions) |

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f1e7aa7c-0ce5-4a8a-9e5d-737a10658e28) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## CI/CD Process

This project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/ci-cd.yml`.

### CI/CD Pipeline Stages

1. **Build and Test**
   - Checkout code
   - Setup Node.js environment
   - Install dependencies
   - Run type checking
   - Run linting
   - Run tests
   - Build the application

2. **Staging Deployment**
   - Automatically triggered when changes are pushed to the main branch
   - Deploys the build to the staging environment
   - Runs smoke tests to verify deployment

3. **Production Deployment**
   - Automatically triggered after successful staging deployment
   - Deploys the build to the production environment
   - Runs final verification tests

### Setting Up GitHub Secrets for CI/CD

To enable the CI/CD pipeline, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

**Required for Build:**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Required for Deployment:**
- `DEPLOY_SSH_KEY`: Your SSH private key for deployment
- `STAGING_SERVER_IP`: IP address of your staging server
- `STAGING_SERVER_USER`: SSH username for staging server
- `STAGING_SERVER_PATH`: Path to deploy to on staging server
- `PRODUCTION_SERVER_IP`: IP address of your production server
- `PRODUCTION_SERVER_USER`: SSH username for production server
- `PRODUCTION_SERVER_PATH`: Path to deploy to on production server

### Checking CI/CD Status

You can check the status of your CI/CD pipeline using the provided script:

```sh
# Check CI/CD status
npm run ci:status
```

Or manually by visiting the Actions tab in your GitHub repository.

### Manual Deployment

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

### Troubleshooting CI/CD Issues

If you encounter issues with the CI/CD pipeline:

1. **Check GitHub Actions logs** in the Actions tab of your repository
2. **Verify all required secrets** are properly set
3. **Check for Rollup dependency issues** - the pipeline includes special handling for platform-specific Rollup dependencies
4. **Ensure SSH access is properly configured** for deployment servers

## How can I deploy this project?

There are multiple ways to deploy this project:

1. **Automated CI/CD**: Push changes to the main branch to trigger the CI/CD pipeline.

2. **Manual Deployment Scripts**: Use the PowerShell scripts in the `scripts` directory.

3. **Lovable Platform**: Open [Lovable](https://lovable.dev/projects/f1e7aa7c-0ce5-4a8a-9e5d-737a10658e28) and click on Share -> Publish.

## Custom Domains

For custom domains, you can:

1. **Configure in CI/CD**: Update the deployment environment variables with your custom domain settings.

2. **Manual Setup**: If you want to deploy your project under your own domain, we recommend using Netlify or Vercel. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

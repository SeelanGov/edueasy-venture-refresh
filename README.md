# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f1e7aa7c-0ce5-4a8a-9e5d-737a10658e28

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

# Step 3: Set up environment variables.
cp .env.example .env
# Edit .env with your Supabase credentials

# Step 4: Install the necessary dependencies.
npm install

# Step 5: Fix platform-specific dependencies if needed.
npm run fix-rollup

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Setup

This project requires the following environment variables:

```
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For loveable.dev preview environments, a mock Supabase client is automatically used if these variables are not set.

## Troubleshooting Common Issues

### Build Failures

If you encounter build failures related to Rollup dependencies, run:

```sh
npm run fix-rollup
```

This script detects your operating system and installs the appropriate platform-specific Rollup binary.

For more comprehensive dependency fixes:

```sh
npm run fix-deps
```

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more detailed information.

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f1e7aa7c-0ce5-4a8a-9e5d-737a10658e28) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

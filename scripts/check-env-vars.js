// Check required Supabase environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check if we're in a preview environment (like loveable.dev)
const isPreviewEnv = process.env.NODE_ENV === 'preview' || 
                    process.env.LOVEABLE_PREVIEW === 'true' ||
                    process.env.CI_ENVIRONMENT_NAME === 'preview';

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  if (isPreviewEnv) {
    console.warn(`\nWARNING: Missing environment variables in preview environment: ${missing.join(', ')}`);
    console.log('✓ Continuing with preview build using mock values.');
  } else {
    console.error(`\nERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
} else {
  console.log('✓ All required Supabase environment variables are set.');
}

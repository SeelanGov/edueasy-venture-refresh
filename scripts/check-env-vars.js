// Check required Supabase environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Check if we're in a preview or CI environment
const isPreviewEnv = process.env.NODE_ENV === 'preview' || 
                    process.env.LOVEABLE_PREVIEW === 'true' ||
                    process.env.CI_ENVIRONMENT_NAME === 'preview';

const isCIEnv = process.env.CI === 'true';

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  if (isPreviewEnv || isCIEnv) {
    console.warn(`\nWARNING: Missing environment variables in ${isPreviewEnv ? 'preview' : 'CI'} environment: ${missing.join(', ')}`);
    console.log('✓ Continuing with build using mock values for non-production environment.');
    
    // Set mock values for CI/preview environments
    missing.forEach(varName => {
      if (varName === 'VITE_SUPABASE_URL') {
        process.env[varName] = 'https://mock-supabase-url.supabase.co';
        console.log(`  - Set mock value for ${varName}`);
      } else if (varName === 'VITE_SUPABASE_ANON_KEY') {
        process.env[varName] = 'mock-supabase-anon-key-for-ci-environment';
        console.log(`  - Set mock value for ${varName}`);
      }
    });
  } else {
    console.error(`\nERROR: Missing required environment variables: ${missing.join(', ')}`);
    console.error('These variables are required for the application to function properly.');
    console.error('Please set them in your environment or .env file.');
    process.exit(1);
  }
} else {
  console.log('✓ All required Supabase environment variables are set.');
}
